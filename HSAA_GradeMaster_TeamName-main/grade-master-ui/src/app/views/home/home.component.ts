import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importieren von Router

/**
 * Die HomeComponent-Komponente stellt die Startseite der Anwendung dar.
 * Sie bietet Navigationsmethoden, um zu verschiedenen Bereichen der Anwendung zu gelangen.
 *
 * @component
 */
@Component({
  selector: 'app-home', // Der Selektor für die Komponente, der im HTML verwendet wird.
  templateUrl: './home.component.html', // Der Pfad zur HTML-Datei der Komponente.
  styleUrls: ['./home.component.scss'], // Der Pfad zur SCSS-Datei für das Styling der Komponente.
  standalone: true, // Gibt an, dass diese Komponente eine Standalone-Komponente ist.
  imports: [
    CommonModule, // Das Modul für grundlegende Angular-Funktionalitäten.
    RouterModule // Das Modul für Routing-Funktionalitäten.
  ]
})
export class HomeComponent {
  /**
   * Der Konstruktor der HomeComponent, der den Router für die Navigation injiziert.
   *
   * @param {Router} private router - Der Angular Router zum Navigieren zwischen verschiedenen Routen.
   */
  constructor(private router: Router) {} // Router-Injektion

  /**
   * Navigiert zur Kursübersichts-Seite.
   * Wird durch Benutzerinteraktionen ausgelöst, wie z. B. Klicks auf Buttons.
   *
   * @returns {void}
   */
  navigateToCourses() {
    this.router.navigate(['/courses/overview']);
  }

  /**
   * Navigiert zur Studentenliste-Seite.
   * Wird durch Benutzerinteraktionen ausgelöst, wie z. B. Klicks auf Buttons.
   *
   * @returns {void}
   */
  navigateToStudents() {
    this.router.navigate(['/students/list']);
  }

  /**
   * Navigiert zur Notenspiegel-Seite.
   * Wird durch Benutzerinteraktionen ausgelöst, wie z. B. Klicks auf Buttons.
   *
   * @returns {void}
   */
  navigateToNotenspiegel(){
    this.router.navigate(['/notenspiegel'])
  }
}
