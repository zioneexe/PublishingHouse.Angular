import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { BookDetailsComponent } from './features/book-details/book-details.component';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - pH',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - pH',
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
    title: 'Unauthorized - pH',
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment.component').then((m) => m.PaymentComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] },
    title: 'Payment - pH',
  },
  {
    path: 'customer-orders',
    loadComponent: () =>
      import('./features/customer-orders/customer-orders.component').then((m) => m.CustomerOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] },
    title: 'Your orders - pH',
  },
  {
    path: 'employee-orders',
    loadComponent: () =>
      import('./features/employee-orders/employee-orders.component').then((m) => m.EmployeeOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee', 'Admin'] },
    title: '[Employee] Orders - pH',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin-orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    title: '[Admin] Dashboard - pH',
  },
  { path: 'books/view/:id', component: BookDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: '404 - Page Not Found' },
];
