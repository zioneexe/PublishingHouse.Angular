import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.baseApiUrl}/api/employees`;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}
