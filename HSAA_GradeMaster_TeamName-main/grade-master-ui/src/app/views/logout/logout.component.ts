import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../lib/provider-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  invalidLogin: boolean = false;
  loginSuccess: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    this.authService.authenticate(this.username, this.password).subscribe({
      next: (result) => {
        this.loginSuccess = true;
        this.successMessage = 'Login successful!';
        this.invalidLogin = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.invalidLogin = true;
        this.errorMessage = 'Invalid username or password!';
        this.loginSuccess = false;
      }
    });
  }
}
