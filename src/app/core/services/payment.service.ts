import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = environment.baseApiUrl + '/api/payments';

  constructor(private http: HttpClient) {}

  getTotalAmount(customerId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total/${customerId}`);
  }

  initiatePayment(amount: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/initiate`, { amount });
  }
}
