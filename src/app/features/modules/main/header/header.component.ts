import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  username: string | null = '';

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('userName');
  }
}
