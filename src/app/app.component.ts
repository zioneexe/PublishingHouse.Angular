import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MainModule } from './features/modules/main/main.module';
import { CommonModule } from '@angular/common';
import { OrderService } from './core/services/order.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MainModule,
    CommonModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'publishing-house';

  constructor(private router: Router) {}

  shouldShowHeaderFooter(): boolean {
    const excludedRoutes = ['/login', '/register', '/unauthorized', '/payment'];
    const isPageNotFound = this.router.url === '/not-found' || this.router.url === '/404';
    return !excludedRoutes.some((route) => this.router.url.startsWith(route)) && !isPageNotFound;
  }
}
