import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const isTokenValid = this.validateToken(token); 
      if (isTokenValid) {
        return true;
      }
    }
  
    this.router.navigate(['/login']);
    return false;
  }
  
  validateToken(token: string): boolean {
    /*try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch (e) {
      return false;
    }*/
   return true;
  }
  
}
