import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PaymentRequest } from '../../core/models/PaymentRequest';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PaymentValidationService } from '../../core/services/payment-validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [
    CurrencyUAHPipe,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class PaymentComponent implements OnInit {
  totalAmount: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  paymentForm: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private paymentValidationService: PaymentValidationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, this.cardNumberValidator.bind(this)],
      ],
      expiryDate: [
        '',
        [Validators.required, this.expiryDateValidator.bind(this)],
      ],
      cvv: ['', [Validators.required, this.cvvValidator.bind(this)]],
    });
  }

  ngOnInit(): void {
    this.fetchTotalAmount();
  }

  fetchTotalAmount(): void {
    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.errorMessage = 'Customer ID is not available.';
      this.isLoading = false;
      return;
    }

    this.paymentService.getTotalAmount(customerId).subscribe({
      next: (amount) => {
        this.totalAmount = amount;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch total amount. Please try again.';
        console.error('Error fetching total amount:', err);
        this.isLoading = false;
      },
    });
  }

  onSubmitPayment(): void {
    if (this.paymentForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const { cardNumber, expiryDate, cvv } = this.paymentForm.value;

    const paymentDetails: PaymentRequest = {
      amount: this.totalAmount,
      cardNumber,
      expiryDate,
      cvv,
    };

    console.log(paymentDetails);

    this.paymentService.initiatePayment(paymentDetails).subscribe({
      next: (paymentResponse) => {
        console.log(paymentResponse);

        if (paymentResponse.result === 'ok') {
          this.handlePaymentSuccess(paymentResponse);
        } else {
          this.handlePaymentError(paymentResponse);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to initiate payment. Please try again.';
        console.error('Error initiating payment:', err);
      },
    });
  }

  private handlePaymentSuccess(paymentResponse: any): void {
    this.errorMessage = null;
    console.log('Payment was successful:', paymentResponse);

    this.router.navigate(['/payment-success'], {
      queryParams: { transactionId: paymentResponse.transaction_id },
    });
  }

  private handlePaymentError(paymentResponse: any): void {
    this.errorMessage =
      'Payment failed. Please try again. [' +
      paymentResponse.err_description +
      ']';
    console.error('Payment error details:', paymentResponse);
  }

  cardNumberValidator(control: AbstractControl) {
    if (!this.paymentValidationService.validateCardNumber(control.value)) {
      return { invalidCardNumber: true };
    }
    return null;
  }

  expiryDateValidator(control: AbstractControl) {
    if (!this.paymentValidationService.validateExpiryDate(control.value)) {
      return { invalidExpiryDate: true };
    }
    return null;
  }

  cvvValidator(control: AbstractControl) {
    if (!this.paymentValidationService.validateCVV(control.value)) {
      return { invalidCVV: true };
    }
    return null;
  }
}
