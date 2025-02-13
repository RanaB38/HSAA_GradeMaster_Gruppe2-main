import { Component } from '@angular/core'; // Importiert den Component-Dekorator von Angular
import { Router } from '@angular/router'; // Importiert Router für die Navigation
import { AuthService } from '../../../lib/provider-services/auth.service'; // Importiert den AuthService für die Authentifizierung

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
  templateUrl: './login.component.html',
  standalone: true,
  // Der Pfad zur HTML-Vorlage des Components
  styleUrls: ['./login.component.scss'] // Der Pfad zur SCSS-Datei des Components
})
export class LoginComponent {
  username: string = ''; // Benutzername des Nutzers
  password: string = ''; // Passwort des Nutzers
  invalidLogin: boolean = false; // Flag, das angibt, ob die Anmeldung fehlgeschlagen ist
  loginSuccess: boolean = false; // Flag, das angibt, ob die Anmeldung erfolgreich war
  errorMessage: string = ''; // Fehlermeldung bei ungültigen Anmeldedaten
  successMessage: string = ''; // Erfolgsnachricht nach erfolgreicher Anmeldung

  /**
   * Der Konstruktor injiziert den AuthService für die Authentifizierung und den Router für das Navigieren.
   *
   * @param {AuthService} authService - Der Service, der für die Authentifizierung zuständig ist
   * @param {Router} router - Der Router, um nach erfolgreicher Anmeldung zur Startseite zu navigieren
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Diese Methode verarbeitet die Anmeldung des Benutzers.
   * Sie ruft den AuthService auf, um den Benutzer zu authentifizieren.
   *
   * @returns {void}
   */
  handleLogin() {
    // Ruft den AuthService auf, um die Authentifizierung zu überprüfen
    this.authService.authenticate(this.username, this.password).subscribe({
      next: (result) => { // Erfolgreiche Authentifizierung
        this.loginSuccess = true;
        this.successMessage = 'Login successful!'; // Erfolgsnachricht anzeigen
        this.invalidLogin = false;
        this.router.navigate(['/home']); // Navigiert zur Startseite nach erfolgreichem Login
      },
      error: (err) => { // Fehler bei der Authentifizierung
        this.invalidLogin = true;
        this.errorMessage = 'Invalid username or password!'; // Fehlermeldung anzeigen
        this.loginSuccess = false;
      }
    });
  }
}
