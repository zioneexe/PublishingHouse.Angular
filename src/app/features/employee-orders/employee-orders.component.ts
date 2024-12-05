import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { CurrencyUAHPipe } from "../../core/pipes/currency-uah.pipe";
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-employee-orders',
  templateUrl: './employee-orders.component.html',
  styleUrls: ['./employee-orders.component.scss'],
  imports: [
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    CurrencyUAHPipe,
    FormsModule
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

  orderStatuses = [
    { id: 1, name: 'In Progress' },
    { id: 2, name: 'Completed' },
    { id: 3, name: 'Cancelled' },
    { id: 4, name: 'On Hold' }
  ];  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const id = this.authService.getUserId();

    this.orderService.getOrdersByEmployeeId(id ?? 0).subscribe((orders) => {
      this.dataSource.data = orders.map((order: any) => {
        return {
          ...order,
          orderStatus: order.orderStatus || this.getDefaultStatus(),
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

  getDefaultStatus(): any {
    return this.orderStatuses?.[0] || { id: null, name: 'Unknown' };
  }

  onStatusChange(order: any, newStatusId: number): void {
    if (order.orderStatus.id !== newStatusId) {
      this.orderService.updateOrder(order.orderId, { orderStatusId: newStatusId }).subscribe({
        next: () => {
          console.log(`Order ${order.id} status updated successfully.`);
          order.orderStatus.id = newStatusId;
        },
        error: (err) => {
          console.error(`Error updating order ${order.id} status:`, err);
        },
      });
    }
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
    const dialogRef = this.dialog.open(EditOrderComponent, {
      width: '500px',
      data: order,
      disableClose: true, 
      autoFocus: true, 
    });
  
    dialogRef.afterClosed().subscribe((updatedOrder) => {
      if (updatedOrder) {
        this.orderService.updateOrder(order.id, updatedOrder).subscribe({
          next: () => {
            console.log('Order updated successfully');
            this.loadOrders();
          },
          error: (err) => {
            console.error('Error updating order:', err);
          },
        });
      }
    });
  }
  
  onDelete(order: any): void {
    if (confirm(`Are you sure you want to delete order ${order.number}?`)) {
      this.orderService.deleteOrder(order.orderId).subscribe({
        next: () => {
          console.log('Order deleted successfully');
          this.dataSource.data = this.dataSource.data.filter((o) => o.id !== order.id);
        },
        error: (err) => {
          console.error('Error deleting order:', err);
        },
      });
    }
  }
}
