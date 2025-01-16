import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/public/v1/user';
  private role: 'STUDENT' | 'LECTURER' = 'STUDENT';
  private username: string = '';

  constructor(private http: HttpClient) {
    // Wenn Benutzerdaten im localStorage vorhanden sind, diese beim Starten der App setzen
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername && storedRole) {
      this.username = storedUsername;
      this.role = storedRole as 'STUDENT' | 'LECTURER';
    }
  }

  authenticate(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.get<any>(`${this.baseUrl}/auth`, { headers }).pipe(
      tap((response) => {
        // Die Rolle wird aus der Antwort extrahiert
        const role = response.role ? response.role.replace('ROLE_', '') : 'STUDENT';
        this.setUserRole(role as 'STUDENT' | 'LECTURER');
        this.setUsername(response.username);
      }),
      catchError((error) => {
        console.error('Fehler bei der Authentifizierung:', error);
        return throwError(error);
      })
    );
  }

  setUserRole(role: 'STUDENT' | 'LECTURER') {
    this.role = role;
    localStorage.setItem('role', role);
  }

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUserRole(): 'STUDENT' | 'LECTURER' {
    return this.role;
  }

  getUsername(): string {
    return this.username;
  }

  // Diese Methode gibt die Auth-Header für den HTTP-Request zurück
  getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken'); // authToken aus dem localStorage holen
    return new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
    });
  }
}
