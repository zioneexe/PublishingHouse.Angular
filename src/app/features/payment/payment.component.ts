import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [CurrencyUAHPipe, CommonModule]
})
export class PaymentComponent implements OnInit {
  totalAmount: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchTotalAmount();
  }

  fetchTotalAmount(): void {
    const customerId = this.authService.getCustomerId(); 
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

  initiatePayment(): void {
    if (this.totalAmount <= 0) {
      this.errorMessage = 'Invalid amount. Payment cannot be initiated.';
      return;
    }

    this.paymentService.initiatePayment(this.totalAmount).subscribe({
      next: (paymentUrl) => {
        window.location.href = paymentUrl; // Redirect to LiqPay payment page
      },
      error: (err) => {
        this.errorMessage = 'Failed to initiate payment. Please try again.';
        console.error('Error initiating payment:', err);
      },
    });
  }
}
