import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  private baseUrl = `${environment.baseApiUrl}/api/order-statuses`;

  constructor(private http: HttpClient) {}

  getOrderStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
