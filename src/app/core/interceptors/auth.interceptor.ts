import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Clone the request and add the Authorization header
    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized
        if (error.status === 401) {
          alert('Unauthorized. Redirecting to login.');
          localStorage.clear(); // Clear token and other details
          this.router.navigate(['/login']);
        }

        // Handle other errors
        if (error.status === 500) {
          alert('A server error occurred. Please try again later.');
        }

        // Use updated `throwError` syntax
        return throwError(() => new Error(error.message || 'An unexpected error occurred.'));
      })
    );
  }
}
