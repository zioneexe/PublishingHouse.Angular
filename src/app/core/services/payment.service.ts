import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaymentRequest } from '../models/PaymentRequest';
import { PaymentResponse } from '../models/PaymentResponse';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = `${environment.baseApiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  getTotalAmount(customerId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total/${customerId}`);
  }

  initiatePayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/initiate`, paymentRequest);
  }
}
