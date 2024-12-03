import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../models/LoginResponse';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.baseApiUrl + '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: User) {
    return this.http.post(`${this.url}/register`, userData);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials);
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);
  }

  getCustomerId(): number | null {
    const customerId = localStorage.getItem('id');
    return customerId ? parseInt(customerId, 10) : null;
  }
}
