import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Überprüfen, ob ein Token existiert
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Weiterleiten, wenn nicht angemeldet
    }
    return isAuthenticated;
  }
}
