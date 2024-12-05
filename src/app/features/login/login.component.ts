import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginResponse } from '../../core/models/LoginResponse';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  form: FormGroup = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: [
      '',
      { validators: [Validators.required, Validators.minLength(6)] },
    ],
  });

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.authService.login({ email: email, password }).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful', response);

          localStorage.setItem('id', response.id?.toString());
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('userName', response.userName);

          this.redirectUser(response.role);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.error?.message || 'An error occurred during login. Please try again.';

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  private redirectUser(role: string): void {
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'Employee':
        this.router.navigate(['/employee-orders']);
        break;
      case 'Customer':
        this.router.navigate(['/customer-orders']);
        break;
      default:
        console.error('Unknown role:', role);
        break;
    }
  }
}
