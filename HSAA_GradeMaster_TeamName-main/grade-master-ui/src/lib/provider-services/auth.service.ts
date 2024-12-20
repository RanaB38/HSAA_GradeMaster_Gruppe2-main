import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticate(username: string, password: string): Observable<any> {
    // Simulate API call
    if (username === 'admin' && password === 'password') {
      return of({ success: true });
    } else {
      throw new Error('Invalid username or password');
    }
  }
}
