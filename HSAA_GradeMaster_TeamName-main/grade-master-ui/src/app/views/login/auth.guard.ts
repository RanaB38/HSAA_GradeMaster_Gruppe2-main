import { Injectable } from '@angular/core'; // Importiert den Injectable-Dekorator von Angular, um die Klasse als Service bereitzustellen
import { CanActivate, Router } from '@angular/router'; // Importiert CanActivate für die Authentifizierung der Routen und Router für das Navigieren

/**
 * AuthGuard ist ein Guard, der überprüft, ob der Benutzer authentifiziert ist, bevor er eine Route betritt.
 *
 * @service
 * @example
 * // Beispiel für die Nutzung des AuthGuards in einer Route
 * {
 *   path: 'protected-route',
 *   component: ProtectedComponent,
 *   canActivate: [AuthGuard]
 * }
 */
@Injectable({
  providedIn: 'root', // Stellt sicher, dass der Service auf der Root-Ebene der App bereitgestellt wird
})
export class AuthGuard implements CanActivate {

  /**
   * Konstruktor, um den Router zu injizieren.
   *
   * @param {Router} router - Der Router, um Navigationen durchzuführen
   */
  constructor(private router: Router) {}

  /**
   * Überprüft, ob der Benutzer berechtigt ist, auf die Route zuzugreifen.
   *
   * @returns {boolean} - Gibt true zurück, wenn der Benutzer authentifiziert ist, andernfalls false und leitet zum Login weiter
   */
  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Überprüfen, ob ein Token im LocalStorage vorhanden ist
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Leitet den Benutzer zur Login-Seite, wenn er nicht authentifiziert ist
    }
    return isAuthenticated;
  }
}
