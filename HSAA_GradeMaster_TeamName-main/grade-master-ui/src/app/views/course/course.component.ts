import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialColor } from '../../../lib/enums/material-color';
import { RouterModule } from '@angular/router';

/**
 * Die CourseComponent-Komponente stellt die Kursübersicht dar und verwendet eine Material Toolbar.
 * Sie ermöglicht das Festlegen eines Titels und einer Farbe für die Toolbar.
 *
 * @component
 */
@Component({
  selector: 'app-course', // Der Selektor für die Komponente, der im HTML verwendet wird.
  standalone: true, // Gibt an, dass diese Komponente eine Standalone-Komponente ist.
  imports: [
    CommonModule, // Das Modul für grundlegende Angular-Funktionalitäten.
    RouterModule, // Das Modul für Routing-Funktionalitäten.
    MatToolbarModule, // Das Modul für Material Toolbar-Komponenten.
  ],
  templateUrl: './course.component.html', // Der Pfad zur HTML-Datei der Komponente.
  styleUrl: './course.component.scss' // Der Pfad zur SCSS-Datei für das Styling der Komponente.
})
export class CourseComponent {

  /**
   * Der Titel, der in der Toolbar angezeigt wird.
   * Standardmäßig auf 'Kurse' gesetzt.
   * @type {string}
   */
  public title = 'Kurse';

  /**
   * Die Farbe der Material Toolbar. Wird auf 'warn' gesetzt.
   * @type {MaterialColor}
   */
  public color: MaterialColor = 'warn';
}
