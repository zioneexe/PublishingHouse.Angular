import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - Publishing House',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Publishing House',
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
    title: 'Unauthorized - Publishing House',
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment.component').then((m) => m.PaymentComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] },
    title: 'Payment - Publishing House',
  },
  {
    path: 'customer-orders',
    loadComponent: () =>
      import('./features/customer-orders/customer-orders.component').then((m) => m.CustomerOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] },
    title: 'Customer Orders - Publishing House',
  },
  {
    path: 'employee-orders',
    loadComponent: () =>
      import('./features/employee-orders/employee-orders.component').then((m) => m.EmployeeOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee', 'Admin'] },
    title: 'Employee Orders - Publishing House',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin-orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    title: 'Admin Dashboard - Publishing House',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: '404 - Page Not Found' },
];
