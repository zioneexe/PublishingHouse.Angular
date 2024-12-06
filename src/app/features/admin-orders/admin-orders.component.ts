import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OrderRequestService } from '../../core/services/order-request.service';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrencyUAHPipe } from '../../core/pipes/currency-uah.pipe';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintOrderUpdateRequest } from '../../core/models/PrintOrderUpdateRequest';
import { OrderStatusService } from '../../core/services/order-status.service';
import { OrderBookService } from '../../core/services/order-book.service';
import { BookService } from '../../core/services/book.service';
import { EmployeeSelectionDialogComponent } from '../employee-selection-dialog/employee-selection-dialog.component';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
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
    MatTabsModule,
    FormsModule,
  ],
})
export class AdminOrdersComponent implements OnInit {
  deleteOrder(_t61: any) {
    throw new Error('Method not implemented.');
  }
  editOrder(_t61: any) {
    throw new Error('Method not implemented.');
  }

  orderRequestColumns: string[] = [
    'customerName',
    'bookName',
    'quantity',
    'authorName',
    'genre',
    'publicationYear',
    'printType',
    'paperType',
    'coverType',
    'fasteningType',
    'isLaminated',
    'completionDate',
    'actions',
  ];

  allOrdersColumns: string[] = [
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

  orderStatuses: any[] = [];
  employees: any[] = [];

  dataSource1 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;

  constructor(
    private orderRequestService: OrderRequestService,
    private orderStatusService: OrderStatusService,
    private orderService: OrderService,
    private bookService: BookService,
    private orderBookService: OrderBookService,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrderStatuses();
    this.loadEmployees(); 
    this.loadOrderRequests();
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;

    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
  }

  loadOrderStatuses(): void {
    this.orderStatusService.getOrderStatuses().subscribe((statuses) => {
      this.orderStatuses = statuses;
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        console.log('Loaded employees:', this.employees);
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      },
    });
  }

  loadOrderRequests(): void {
    this.orderRequestService.getAllOrderRequests().subscribe((orders) => {
      this.dataSource1.data = orders;
      console.log(orders);
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.dataSource2.data = orders.map((order: any) => {
        return {
          ...order,
          orderStatus: order.orderStatus || this.getDefaultStatus(),
          executionDays: this.calculateDateDifference(
            order.registrationDate ? new Date(order.registrationDate) : null,
            order.completionDate ? new Date(order.completionDate) : null
          ),
        };
      });
    });
  }

  getDefaultStatus(): any {
    return this.orderStatuses?.[0] || { id: null, name: 'Unknown' };
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

  applyFilter(dataSource: MatTableDataSource<any>, event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAccept(orderRequest: any): void {
    this.orderRequestService.calculatePrice(orderRequest).subscribe({
      next: (calculatedPrice) => {
        const dialogRef = this.dialog.open(EmployeeSelectionDialogComponent, {
          width: '400px',
          data: { employees: this.employees }, 
        });
  
        dialogRef.afterClosed().subscribe((selectedEmployee) => {
          if (!selectedEmployee) {
            console.log('No employee selected.');
            return;
          }
  
          const book = {
            name: orderRequest.bookName,
            author: orderRequest.authorName,
            genre: orderRequest.genre,
            sku: Math.floor(1000 + Math.random() * 9000),
            isbn: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
            pages: Math.floor(100 + Math.random() * 400), 
            publicationYear: orderRequest.publicationYear,
            size: `${Math.floor(15 + Math.random() * 10)}x${Math.floor(20 + Math.random() * 10)} cm`,
            weight: Math.floor(300 + Math.random() * 200),
            annotation: 'This is a placeholder annotation.',
            coverImagePath: orderRequest.coverImagePath || '',
          };
  
          this.bookService.createBookWithId(book).subscribe({
            next: (book) => {
              const order = {
                number: Math.floor(100000 + Math.random() * 900000),
                printType: orderRequest.printType,
                paperType: orderRequest.paperType,
                coverType: orderRequest.coverType,
                fasteningType: orderRequest.fasteningType,
                isLaminated: orderRequest.isLaminated,
                price: calculatedPrice,
                orderStatusId: 1,
                registrationDate: new Date().toISOString().split('T')[0],
                completionDate: new Date(orderRequest.completionDate).toISOString().split('T')[0], 
                customerId: orderRequest.customer.customerId,
                employeeId: selectedEmployee.employeeId, 
              };

              console.log(book.bookId);
  
              this.orderService.createOrderWithId(order).subscribe({
                next: (order) => {
                  console.log(order);
                  console.log(order.orderId);

                  const orderBook = {
                    bookId: book.bookId,
                    orderId: order.orderId,
                    bookQuantity: orderRequest.quantity,
                  };
  
                  this.orderBookService.createOrderBook(orderBook).subscribe({
                    next: () => {
                      this.orderRequestService
                        .deleteOrderRequest(orderRequest.orderRequestId)
                        .subscribe({
                          next: () => {
                            this.dataSource1.data = this.dataSource1.data.filter(
                              (o) => o.orderRequestId !== orderRequest.orderRequestId
                            );
                            console.log('Order request successfully accepted.');
                          },
                          error: (err) =>
                            console.error('Error deleting order request:', err),
                        });
                    },
                    error: (err) =>
                      console.error('Error creating order book:', err),
                  });
                },
                error: (err) => console.error('Error creating order:', err),
              });
            },
            error: (err) => console.error('Error creating book:', err),
          });
        });
      },
      error: (err) => console.error('Error calculating price:', err),
    });
  }

  onReject(orderRequest: any): void {
    if (confirm(`Are you sure you want to reject this order request?`)) {
      this.orderRequestService
        .deleteOrderRequest(orderRequest.orderRequestId)
        .subscribe({
          next: () => {
            this.dataSource1.data = this.dataSource1.data.filter(
              (o) => o.orderRequestId !== orderRequest.orderRequestId
            );
            console.log('Order request successfully rejected.');
          },
          error: (err) => console.error('Error deleting order request:', err),
        });
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
          console.log(`Order ${order.id} status updated successfully.`);
          order.orderStatus.id = newStatusId;
        },
        error: (err) => {
          console.error(`Error updating order ${order.id} status:`, err);
        },
      });
    }
  }

  onDelete(order: any): void {
    if (confirm(`Are you sure you want to delete this order?`)) {
      this.orderService.deleteOrder(order.orderId).subscribe({
        next: () => {
          console.log(`Order deleted successfully`);
          this.dataSource2.data = this.dataSource2.data.filter(
            (o) => o.orderId !== order.orderId
          );
        },
        error: (err) => {
          console.error(`Error deleting order:`, err);
        },
      });
    }
  }
  
}
