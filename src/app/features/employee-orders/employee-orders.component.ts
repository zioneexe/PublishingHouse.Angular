import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { CurrencyUAHPipe } from "../../core/pipes/currency-uah.pipe";

@Component({
  selector: 'app-employee-orders',
  templateUrl: './employee-orders.component.html',
  styleUrls: ['./employee-orders.component.scss'],
  imports: [
    MatTableModule,
    MatPaginator,
    CommonModule,
    CurrencyUAHPipe
  ]
})
export class EmployeeOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'printType',
    'paperType',
    'coverType',
    'fasteningType',
    'isLaminated',
    'registrationDate',
    'completionDate',
    'executionDays',
    'customerName',
    'price',
    'orderStatus',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.dataSource.data = orders.map((order: any) => {
        return {
          ...order,
          executionDays: this.calculateDateDifference(
            order.registrationDate ? new Date(order.registrationDate) : null,
            order.completionDate ? new Date(order.completionDate) : null
          ),
        };
      });
      this.dataSource.paginator = this.paginator;
      console.log(orders);
    });
  }

  calculateDateDifference(startDate: Date | null, endDate: Date | null): number | null {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return null; 
    }
    const diffInTime = endDate.getTime() - startDate.getTime();
    return Math.floor(diffInTime / (1000 * 60 * 60 * 24));
  }

  deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (order: any) => order.id !== orderId
      );
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      case 'On Hold':
        return 'status-on-hold';
      default:
        return '';
    }
  }

  onEdit(order: any): void {
    // Implement edit functionality here
    console.log('Edit order:', order);
  }
  
  onDelete(order: any): void {
    // Implement delete functionality here
    if (confirm(`Are you sure you want to delete order ${order.number}?`)) {
      this.deleteOrder(order.id);
    }
  }
}
