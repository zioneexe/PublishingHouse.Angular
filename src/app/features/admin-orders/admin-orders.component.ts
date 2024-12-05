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

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    ShowIfNotEmptyDirective,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class AdminOrdersComponent implements OnInit {

  allOrders: any[] = [];

  constructor(private orderRequestService: OrderRequestService) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.orderRequestService.getAllOrderRequests().subscribe({
      next: (orders) => {
        this.allOrders = orders;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  onOrderAdded(): void {
    this.loadAllOrders();
  }

  addOrder() {
    throw new Error('Method not implemented.');
  }
}
