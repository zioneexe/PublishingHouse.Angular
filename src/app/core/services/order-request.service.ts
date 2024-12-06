import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { OrderRequest } from '../models/OrderRequest';

@Injectable({
  providedIn: 'root',
})
export class OrderRequestService {
  private baseUrl = `${environment.baseApiUrl}/api/order-requests`;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<{ filePath: string }> {
    return this.http.post<{ filePath: string }>(
      `${this.baseUrl}/upload-file`,
      formData
    );
  }

  getAllOrderRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getByCustomerId(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  createOrderRequest(orderRequest: OrderRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl, orderRequest);
  }

  updateOrderRequest(orderRequestId: number, orderRequest: OrderRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${orderRequestId}`, orderRequest);
  }  

  calculatePrice(orderRequest: OrderRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/calculate-price`, orderRequest);
  }

  deleteOrderRequest(orderRequestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderRequestId}`);
  }
}
