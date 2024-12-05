import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });
          localStorage.clear();
          this.router.navigate(['/login']);
        }

        if (error.status === 500) {
          this.snackBar.open('A server error occurred. Try again later.', 'Close', { duration: 3000 });
        }

        if (error.status === 0) {
          this.snackBar.open(
            'Unable to connect to the server. Please check your network connection.',
            'Retry',
            { duration: 5000 }
          ).onAction().subscribe(() => {
            location.reload();
          });
        }

        return throwError(() => new Error(error.message || 'An unexpected error occurred.'));
      })
    );
  }
}
