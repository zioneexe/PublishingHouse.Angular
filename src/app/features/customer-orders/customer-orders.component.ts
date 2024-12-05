import { Component, OnInit } from '@angular/core';
import { OrderRequestService } from '../../core/services/order-request.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared/shared.module';
import { ModalService } from '../../core/services/order-modal.service';
import { ShowIfNotEmptyDirective } from '../../core/directives/show-if-not-empty.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { PrintOrderResponse } from '../../core/models/PrintOrderResponse';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { OrderBookService } from '../../core/services/order-book.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    ShowIfNotEmptyDirective,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CurrencyUAHPipe
  ],
})
export class CustomerOrdersComponent implements OnInit {
  awaitingOrders: any[] = [];
  customerOrders: PrintOrderResponse[] = [];
  orderBooks: any[] = [];

  constructor(
    private orderRequestService: OrderRequestService,
    private orderBookService: OrderBookService,
    private orderService: OrderService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadAwaitingOrders();
    this.loadCustomerOrders();
    this.loadBooksByOrder(1);
  }

  loadAwaitingOrders(): void {
    const customerId = this.authService.getUserId();

    if (customerId) {
      this.orderRequestService.getByCustomerId(customerId).subscribe({
        next: (orders) => {
          this.awaitingOrders = orders;
        },
        error: (err) => {
          console.error('Error fetching awaiting orders:', err);
        },
      });
    } else {
      console.error('No customer ID found');
    }
  }

  loadCustomerOrders(): void {
    const customerId = this.authService.getUserId();

    if (customerId) {
      this.orderService.getOrdersByCustomerId(customerId).subscribe({
        next: (orders) => {
          this.customerOrders = orders;
        },
        error: (err) => {
          console.error('Error fetching customer orders:', err);
        },
      });
    } else {
      console.error('No customer ID found');
    }
  }

  loadBooksByOrder(orderId: number): void {
    this.orderBookService.getBooksByOrderId(orderId).subscribe({
      next: (books) => {
        this.orderBooks = books;
        console.log(`Books for order #${orderId}:`, books);
      },
      error: (err) => {
        console.error(`Error fetching books for order #${orderId}:`, err);
      },
    });
  }

  addOrder(): void {
    this.modalService.openModal();
  }

  onOrderAdded(): void {
    this.loadAwaitingOrders();
  }

  onCancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          console.log(`Order #${orderId} canceled successfully.`);
          this.loadCustomerOrders();
        },
        error: (err) => {
          console.error(`Error canceling order #${orderId}:`, err);
        },
      });
    }
  }

  onCancelOrderRequest(orderRequestId: number): void {
    this.orderRequestService.deleteOrderRequest(orderRequestId).subscribe({
      next: () => {
        console.log(`Order request #${orderRequestId} deleted successfully.`);
        this.loadAwaitingOrders();
      },
      error: (err) => {
        console.error(`Error deleting order request #${orderRequestId}:`, err);
      },
    });
  }
}   
