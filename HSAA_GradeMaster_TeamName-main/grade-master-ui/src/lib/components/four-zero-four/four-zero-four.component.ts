import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

/**
 * Diese Komponente stellt eine 404-Fehlerseite dar.
 * Sie wird verwendet, wenn eine ungültige Route aufgerufen wird.
 *
 * @usage Wird in der `app-routing.module.ts` definiert.
 */
@Component({
  selector: 'app-four-zero-four',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LayoutModule,
  ],
  templateUrl: './four-zero-four.component.html',
  styleUrl: './four-zero-four.component.scss',
})
export class FourZeroFourComponent {
  /**
   * Diese Komponente enthält keine spezifische Logik,
   * sondern dient nur zur Anzeige der Fehlerseite.
   */
}
