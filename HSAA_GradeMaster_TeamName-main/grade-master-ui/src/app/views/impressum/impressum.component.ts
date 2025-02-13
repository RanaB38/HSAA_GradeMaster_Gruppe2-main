import { LayoutModule } from '@angular/cdk/layout'; // Importiert LayoutModule für Layout-bezogene Funktionen
import { CommonModule } from '@angular/common'; // Importiert CommonModule für grundlegende Angular-Funktionen
import { Component } from '@angular/core'; // Importiert die Base-Komponente für Angular-Komponenten
import { MatButtonModule } from '@angular/material/button'; // Importiert MatButtonModule für Material-Buttons
import { MatIconModule } from '@angular/material/icon'; // Importiert MatIconModule für Material-Icons
import { MatToolbarModule } from '@angular/material/toolbar'; // Importiert MatToolbarModule für Material-Toolbar
import { MatTooltipModule } from '@angular/material/tooltip'; // Importiert MatTooltipModule für Tooltips
import { RouterModule } from '@angular/router'; // Importiert RouterModule für Routing-Funktionen

/**
 * Die ImpressumComponent stellt die Seite mit rechtlichen Informationen (Impressum) der Anwendung dar.
 *
 * @component
 */
@Component({
  selector: 'app-impressum', // Der Selektor für diese Komponente
  templateUrl: './impressum.component.html', // Der Pfad zur HTML-Datei der Komponente
  styleUrl: './impressum.component.scss', // Der Pfad zur SCSS-Datei für das Styling der Komponente
  standalone: true, // Gibt an, dass diese Komponente eine Standalone-Komponente ist
  imports: [
    CommonModule, // Importiert grundlegende Angular-Funktionalitäten
    RouterModule, // Importiert das Routing-Modul für Navigationsfunktionen
    MatToolbarModule, // Importiert das Toolbar-Modul für Material-Toolbar-Komponenten
    MatButtonModule, // Importiert das Button-Modul für Material-Button-Komponenten
    MatIconModule, // Importiert das Icon-Modul für Material-Icon-Komponenten
    MatTooltipModule, // Importiert das Tooltip-Modul für Material-Tooltip-Komponenten
    LayoutModule, // Importiert LayoutModule für Layout-bezogene Funktionen
  ]
})
export class ImpressumComponent {}
