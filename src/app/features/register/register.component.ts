import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private errorMessage: string = '';

  fb = inject(NonNullableFormBuilder);

  constructor(private authService: AuthService, private router: Router) {}
  
  form: FormGroup = this.fb.group({
    username: ['', Validators. required],
    email: ['',  { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required, Validators.minLength(8)] }]
  });

  onSubmit() {
    if (this.form.valid) {
      const userData = this.form.getRawValue();
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
