import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PaymentRequest } from '../../core/models/PaymentRequest';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PaymentValidationService } from '../../core/services/payment-validation.service';

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
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
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

    if (!this.paymentValidationService.validateCardNumber(cardNumber)) {
      this.errorMessage = 'Invalid card number.';
      return;
    }

    if (!this.paymentValidationService.validateExpiryDate(expiryDate)) {
      this.errorMessage = 'Invalid expiry date.';
      return;
    }

    if (!this.paymentValidationService.validateCVV(cvv)) {
      this.errorMessage = 'Invalid CVV.';
      return;
    }

    const paymentDetails: PaymentRequest = {
      amount: this.totalAmount,
      cardNumber,
      expiryDate,
      cvv,
    }

    this.paymentService.initiatePayment(paymentDetails).subscribe({
      next: (paymentResponse) => {
        window.location.href = paymentResponse.url;
      },
      error: (err) => {
        this.errorMessage = 'Failed to initiate payment. Please try again.';
        console.error('Error initiating payment:', err);
      },
    });
  }
}
