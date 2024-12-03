import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Unauthorized</h1>
    <p>You do not have access to this page.</p>
    <hr>
    <a routerLink="/login">Return to Login</a>
    <router-outlet></router-outlet>
  `,
})
export class UnauthorizedComponent {}
