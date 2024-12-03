import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../core/services/order-modal.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared/shared.module';
import { ShowIfNotEmptyDirective } from '../../core/directives/show-if-not-empty.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  imports: [CommonModule, SharedModule, ShowIfNotEmptyDirective, RouterModule]
})
export class CustomerOrdersComponent implements OnInit {
  awaitingOrders = [
    { id: 1, bookName: 'Book 1', dateRange: '', status: 'Pending' },
    { id: 2, bookName: 'Book 2', dateRange: '', status: 'Pending' },
  ];
  myOrders = [
    { id: 3, bookName: 'Book 3', dateRange: '01-12-2024 - 10-12-2024', status: 'Confirmed' },
    { id: 4, bookName: 'Book 4', dateRange: '05-12-2024 - 15-12-2024', status: 'Shipped' },
  ];

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  addOrder(): void {
    this.modalService.openModal();
  }

  onOrderAdded(order: any): void {
    const newOrder = {
      id: order.id || Date.now(), 
      bookName: order.bookName,
      dateRange: order.dateRange || '',
      status: 'Pending',
    };
    this.awaitingOrders.push(newOrder);
  }
  

  onDeleteOrder(orderId: number): void {
    this.myOrders = this.myOrders.filter((order) => order.id !== orderId);
  }
}
