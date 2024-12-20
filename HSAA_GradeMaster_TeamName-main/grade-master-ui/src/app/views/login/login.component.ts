import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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

  handleLogin() {
    if (this.username === 'admin' && this.password === 'admin') {
      this.invalidLogin = false;
      this.loginSuccess = true;
    } else {
      this.invalidLogin = true;
      this.loginSuccess = false;
    }
  }
}
