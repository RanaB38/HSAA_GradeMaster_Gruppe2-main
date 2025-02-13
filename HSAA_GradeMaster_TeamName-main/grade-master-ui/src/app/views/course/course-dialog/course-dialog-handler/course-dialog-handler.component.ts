import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseDialogComponent } from '../course-dialog.component';

/**
 * Komponente zum Öffnen und Schließen eines Dialogs über eine Auxiliary Route.
 *
 * Diese Komponente öffnet beim Laden der Seite einen Dialog und schließt
 * die Auxiliary Route, wenn der Dialog geschlossen wird.
 */
@Component({
  selector: 'app-course-dialog-handler',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './course-dialog-handler.component.html',
  styleUrls: ['./course-dialog-handler.component.scss']
})
export class CourseDialogHandlerComponent {

  /**
   * Erzeugt eine Instanz der CourseDialogHandlerComponent.
   *
   * @param dialog - Der Dialog-Service zum Öffnen und Schließen des Dialogs.
   * @param router - Der Router, der zur Steuerung der Navigation verwendet wird.
   */
  constructor(private dialog: MatDialog, private router: Router) {
    // Öffne den Dialog bei Initialisierung
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: { message: 'Dies ist ein Dialog, der über eine Auxiliary Route geöffnet wurde.' },
    });

    // Schließe die Auxiliary Route, wenn der Dialog geschlossen wird
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([{ outlets: { dialog: null } }]); // Schließt die Auxiliary Route
    });
  }
}
