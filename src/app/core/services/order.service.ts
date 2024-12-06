import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { PrintOrder } from '../models/PrintOrder';
import { environment } from '../../../environments/environment.development';
import { PrintOrderResponse } from '../models/PrintOrderResponse';
import { PrintOrderUpdateRequest } from '../models/PrintOrderUpdateRequest';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url = `${environment.baseApiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<void> {
    return this.http.post<void>(this.url, orderData);
  }

  createOrderWithId(orderData: any): Observable<any> {
    return this.http.post<number>(`${this.url}/order-id`, orderData);
  }

  getOrders(): Observable<PrintOrder[]> {
    return this.http.get<PrintOrder[]>(this.url);
  }

  getOrdersByEmployeeId(employeeId: number): Observable<PrintOrder[]> {
    return this.http.get<PrintOrder[]>(`${this.url}/employee/${employeeId}`);
  }

  getOrdersByCustomerId(customerId: number): Observable<PrintOrderResponse[]> {
    return this.http.get<PrintOrderResponse[]>(`${this.url}/customer/${customerId}`);
  }

  updateOrder(
    orderId: number,
    updatedOrder: Partial<PrintOrderUpdateRequest>
  ): Observable<PrintOrder> {

    if (!updatedOrder.customerId || !updatedOrder.employeeId) {
      console.error('Invalid customerId or employeeId in the update request.');
      return throwError(() => new Error('Invalid update payload.'));
    }

    return this.http.put<PrintOrder>(`${this.url}/${orderId}`, updatedOrder);
  }

  toggleCompletionStatus(orderId: number): Observable<PrintOrder> {
    return this.http.get<PrintOrder>(`${this.url}/${orderId}`).pipe(
      switchMap((order) => {
        order.completionDate = order.completionDate
          ? null
          : new Date().toISOString();
        return this.http.put<PrintOrder>(`${this.url}/${orderId}`, order);
      })
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${orderId}`);
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${orderId}/cancel`, {});
  }
  
}
