import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/public/v1/user';
  private role: 'STUDENT' | 'LECTURER' = 'STUDENT';

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.get<any>(`${this.baseUrl}/auth`, { headers }).pipe(
      tap((response) => {
        // Angenommene Antwort, dass sie eine Rolle enthält, z.B. "ROLE_LECTURER" oder "ROLE_STUDENT"
        const role = response.role ? response.role.replace('ROLE_', '') : 'STUDENT'; // Entfernen von "ROLE_" und Standard auf STUDENT setzen
        this.setUserRole(role as 'STUDENT' | 'LECTURER'); // Setzt die Rolle korrekt
      }),
      catchError((error) => {
        console.error('Fehler bei der Authentifizierung:', error);
        return throwError(error);
      })
    );
  }

  getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
    });
  }

  setUserRole(role: 'STUDENT' | 'LECTURER'): void {
    this.role = role;
    localStorage.setItem('role', role); // Rolle im LocalStorage speichern, falls gewünscht
  }

  getUserRole(): 'STUDENT' | 'LECTURER' {
    return this.role;
  }
}
