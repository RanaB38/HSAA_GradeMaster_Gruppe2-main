import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CourseCoreService } from "../../../../lib/core-services/course-core.service";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle, MatCardTitle
} from "@angular/material/card";
import { RouterLink } from "@angular/router";

/**
 * Komponente zum Erstellen eines neuen Kurses über einen Dialog.
 *
 * Diese Komponente öffnet einen Dialog, in dem der Benutzer die Kursdetails eingeben kann.
 * Nach erfolgreicher Validierung des Formulars wird der Kurs erstellt und der Dialog geschlossen.
 */
@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    RouterLink,
  ],
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent {

  /**
   * Formular zur Eingabe von Kursinformationen.
   */
  form: FormGroup;

  /**
   * Erzeugt eine Instanz der CourseDialogComponent.
   *
   * @param fb - FormBuilder zur Erstellung des Formulars.
   * @param dialogRef - Referenz zum Dialog, um den Dialog zu schließen.
   * @param coreService - Service, der Kursdaten verwaltet.
   * @param data - Eingabedaten, die an den Dialog übergeben werden.
   */
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coreService: CourseCoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],  // Name des Kurses (erforderlich)
      description: ['']  // Beschreibung des Kurses (optional)
    });
  }

  /**
   * Verarbeitet das Formular und erstellt einen neuen Kurs.
   *
   * Wenn das Formular gültig ist, werden die eingegebenen Daten verarbeitet,
   * der Kurs wird erstellt und der Dialog geschlossen.
   */
  onSubmit() {
    // Prüfen, ob das Formular gültig ist
    if (this.form.valid) {
      // Formulardaten extrahieren
      const formData = this.form.value;
      console.log('Formulardaten verarbeitet:', formData);

      // Kurs hinzufügen
      this.coreService.addCourse(formData);

      // Dialog schließen und die eingegebenen Daten zurückgeben
      this.dialogRef.close(formData);
    } else {
      console.log('Formular ungültig');
    }
  }

  /**
   * Schließt den Dialog ohne eine Aktion durchzuführen.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
