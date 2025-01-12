import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../lib/provider-services/auth.service';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  invalidLogin = false;
  loginSuccess = false;
  errorMessage = 'Invalid username or password';
  successMessage = 'Login successful';

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin(event: Event): void {
    event.preventDefault();

    this.authService.authenticate(this.username, this.password).subscribe(
      (user) => {
        this.invalidLogin = false;
        this.loginSuccess = true;
        this.successMessage = `Welcome, ${user.username}!`;

        localStorage.setItem('authToken', btoa(`${this.username}:${this.password}`));
        this.router.navigate(['/courses']);
      },
      (error) => {
        this.invalidLogin = true;
        this.loginSuccess = false;
        this.errorMessage = 'Authentication failed. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}
