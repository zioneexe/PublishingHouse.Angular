import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  private baseUrl = `${environment.baseApiUrl}/api/order-books`;

  constructor(private http: HttpClient) {}

  createOrderBook(orderBookData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, orderBookData);
  }

  getBooksByOrderId(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/order/${orderId}`);
  }
}
