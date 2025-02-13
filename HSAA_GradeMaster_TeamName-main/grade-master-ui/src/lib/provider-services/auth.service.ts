import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Basis-URL für die Authentifizierungs-API */
  private baseUrl = 'http://localhost:8080/api/public/v1/user';

  /** Aktuelle Benutzerrolle (STUDENT oder LECTURER) */
  private role: 'STUDENT' | 'LECTURER' = 'STUDENT';

  /** Benutzername des aktuell angemeldeten Nutzers */
  private username: string = '';

  constructor(private http: HttpClient) {
    // Benutzerdaten aus dem localStorage laden, falls vorhanden
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');

    if (storedUsername && storedRole) {
      this.username = storedUsername;
      this.role = storedRole as 'STUDENT' | 'LECTURER';
    }
  }

  /**
   * Führt die Authentifizierung eines Benutzers durch.
   * @param {string} username - Der Benutzername.
   * @param {string} password - Das Passwort.
   * @returns {Observable<any>} Ein Observable mit der Antwort des Servers.
   */
  authenticate(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.get<any>(`${this.baseUrl}/auth`, { headers }).pipe(
      tap((response) => {
        this.setUsername(response.username);
        this.setUserRole(response.role.replace('ROLE_', '') as 'STUDENT' | 'LECTURER');
        localStorage.setItem('authToken', btoa(`${username}:${password}`));
      }),
      catchError((error) => {
        console.error('Fehler bei der Authentifizierung:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Setzt die Benutzerrolle und speichert sie im localStorage.
   * @param {'STUDENT' | 'LECTURER'} role - Die Benutzerrolle.
   */
  setUserRole(role: 'STUDENT' | 'LECTURER') {
    this.role = role;
    localStorage.setItem('role', role);
  }

  /**
   * Setzt den Benutzernamen und speichert ihn im localStorage.
   * @param {string} username - Der Benutzername.
   */
  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  /**
   * Gibt die aktuelle Benutzerrolle zurück.
   * @returns {'STUDENT' | 'LECTURER'} Die Benutzerrolle.
   */
  getUserRole(): 'STUDENT' | 'LECTURER' {
    return this.role;
  }

  /**
   * Gibt den Benutzernamen des aktuellen Nutzers zurück.
   * @returns {string} Der Benutzername.
   */
  getUsername(): string {
    return this.username;
  }

  /**
   * Erstellt die Authentifizierungs-Header für HTTP-Anfragen.
   * @returns {HttpHeaders} Die HTTP-Header mit Authentifizierungsinformationen.
   * @throws {Error} Falls kein Authentifizierungs-Token vorhanden ist.
   */
  getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error("Auth token is missing. Please log in again.");
      throw new Error("Authentication token is missing.");
    }
    return new HttpHeaders({
      Authorization: `Basic ${authToken}`,
    });
  }
}
