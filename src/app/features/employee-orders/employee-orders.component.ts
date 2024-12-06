import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgModel } from '@angular/forms';
import { PrintOrderUpdateRequest } from '../../core/models/PrintOrderUpdateRequest';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderStatusService } from '../../core/services/order-status.service';

@Component({
  selector: 'app-employee-orders',
  templateUrl: './employee-orders.component.html',
  styleUrls: ['./employee-orders.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    CurrencyUAHPipe,
    FormsModule,
  ],
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
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  orderStatuses: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrderStatuses();
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrderStatuses(): void {
    this.orderStatusService.getOrderStatuses().subscribe((statuses) => {
      this.orderStatuses = statuses;
    });
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
      const { orderId, ...rest } = order;

      const updatedOrder: Partial<PrintOrderUpdateRequest> = {
        ...rest,
        customerId: order.customer?.customerId ?? null,
        employeeId: order.employee?.employeeId ?? null,
        orderStatusId: newStatusId,
      };

      console.log('Updated: ', updatedOrder);

      this.orderService.updateOrder(order.orderId, updatedOrder).subscribe({
        next: () => {
          console.log(`Order ${order.orderId} status updated successfully.`);
          order.orderStatus.id = newStatusId;
        },
        error: (err) => {
          console.error(`Error updating order ${order.id} status:`, err);
        },
      });
    }
  }

  calculateDateDifference(
    startDate: Date | null,
    endDate: Date | null
  ): number | null {
    if (
      !startDate ||
      !endDate ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
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

    dialogRef.afterClosed().subscribe((updatedDetails) => {
      console.log('U[:', order);
      if (updatedDetails) {
        const { orderId, ...rest } = order;

        let formattedCompletionDate = null;
        if (updatedDetails.completionDate instanceof Date) {
          const date = updatedDetails.completionDate;
          formattedCompletionDate = `${date.getFullYear()}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }

        const updatedOrder: Partial<PrintOrderUpdateRequest> = {
          ...rest,
          customerId: order.customer?.customerId ?? null,
          employeeId: order.employee?.employeeId ?? null,
          orderStatusId: order.orderStatus?.orderStatusId ?? null,
          paperType: updatedDetails.paperType,
          printType: updatedDetails.paperType,
          fasteningType: updatedDetails.fasteningType,
          coverType: updatedDetails.coverType,
          isLaminated: updatedDetails.isLaminated,
          completionDate: formattedCompletionDate,
        };

        console.log(updatedOrder);

        this.orderService.updateOrder(order.orderId, updatedOrder).subscribe({
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
          this.dataSource.data = this.dataSource.data.filter(
            (o) => o.id !== order.id
          );
        },
        error: (err) => {
          console.error('Error deleting order:', err);
        },
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
