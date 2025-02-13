import { Component } from '@angular/core'; // Importiert den Component-Dekorator von Angular
import { FormsModule } from '@angular/forms'; // Importiert FormsModule für Formularverarbeitung
import { AuthService } from '../../../lib/provider-services/auth.service'; // Importiert den AuthService, der für die Authentifizierung zuständig ist
import { CommonModule } from '@angular/common'; // Importiert CommonModule für grundlegende Angular-Funktionalitäten
import { Router } from "@angular/router"; // Importiert Router für das Navigieren innerhalb der Anwendung

/**
 * LoginComponent ermöglicht es Benutzern, sich mit ihren Anmeldeinformationen (Benutzername und Passwort) anzumelden.
 *
 * @component
 * @example
 * // Beispiel für die Verwendung des LoginComponents in einer Route
 * {
 *   path: 'login',
 *   component: LoginComponent
 * }
 */
@Component({
  selector: 'app-login', // Der HTML-Tag, der das Component repräsentiert
  standalone: true, // Kennzeichnet das Component als Standalone (wird ohne Modul geladen)
  imports: [FormsModule, CommonModule], // Importiert die benötigten Module
  templateUrl: './login.component.html', // Der Pfad zur HTML-Vorlage des Components
  styleUrls: ['./login.component.scss'], // Der Pfad zur SCSS-Datei des Components
})
export class LoginComponent {
  username = ''; // Benutzername des Nutzers
  password = ''; // Passwort des Nutzers
  invalidLogin = false; // Flag, das angibt, ob die Anmeldung fehlgeschlagen ist
  loginSuccess = false; // Flag, das angibt, ob die Anmeldung erfolgreich war
  errorMessage = 'Invalid username or password'; // Fehlermeldung bei ungültigen Anmeldedaten
  successMessage = 'Login successful'; // Erfolgsnachricht nach erfolgreicher Anmeldung

  /**
   * Der Konstruktor injiziert den AuthService für die Authentifizierung und den Router für das Navigieren.
   *
   * @param {AuthService} authService - Der Service, der für die Authentifizierung zuständig ist
   * @param {Router} router - Der Router, um nach erfolgreicher Anmeldung zur Startseite zu navigieren
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Diese Methode verarbeitet die Anmeldung des Benutzers.
   * Sie verhindert die Standardaktion des Formulars und führt die Authentifizierung durch.
   *
   * @param {Event} event - Das Ereignis, das beim Absenden des Anmeldeformulars ausgelöst wird
   * @returns {void}
   */
  handleLogin(event: Event): void {
    event.preventDefault(); // Verhindert das Neuladen der Seite bei Formularabsendung

    // Versucht, den Benutzer zu authentifizieren
    this.authService.authenticate(this.username, this.password).subscribe(
      (user) => { // Erfolgreiche Authentifizierung
        this.invalidLogin = false;
        this.loginSuccess = true;
        this.successMessage = `Welcome, ${user.username}!`;

        // Speichert das Authentifizierungstoken im LocalStorage
        localStorage.setItem('authToken', btoa(`${this.username}:${this.password}`));

        // Navigiert zur Startseite nach erfolgreichem Login
        this.router.navigate(['/home']);
      },
      (error) => { // Fehler bei der Authentifizierung
        this.invalidLogin = true;
        this.loginSuccess = false;
        this.errorMessage = 'Authentication failed. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}
