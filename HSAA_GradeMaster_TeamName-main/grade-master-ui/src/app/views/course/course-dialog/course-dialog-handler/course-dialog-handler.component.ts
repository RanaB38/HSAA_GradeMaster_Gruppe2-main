import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseDialogComponent } from '../course-dialog.component';

@Component({
  selector: 'app-course-dialog-handler',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './course-dialog-handler.component.html',
  styleUrl: './course-dialog-handler.component.scss'
})
export class CourseDialogHandlerComponent {

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

