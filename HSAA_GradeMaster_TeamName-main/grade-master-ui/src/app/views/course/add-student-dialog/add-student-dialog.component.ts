import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";
import { AuthService } from "../../../../lib/provider-services/auth.service";

/**
 * Component zum Hinzufügen eines Studenten zu einem Kurs.
 *
 * @component
 */
@Component({
  selector: 'app-add-student-dialog',
  standalone: true,
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatInput,
    MatButton,
    MatFormFieldModule,
    MatIcon
  ]
})
export class AddStudentDialogComponent {

  /** Das Formular zur Eingabe der Studenten-ID. */
  form: FormGroup;

  /** Der Name des gefundenen Studenten. */
  studentName: string | null = null;

  /** Die Fehlermeldung, die angezeigt wird, wenn ein Fehler auftritt. */
  error: string | null = null;

  /** Erfolgsnachricht, die angezeigt wird, wenn der Student erfolgreich hinzugefügt wurde. */
  successMessage: any;

  /**
   * Erzeugt eine Instanz des AddStudentDialogComponents.
   *
   * @param fb - Der FormBuilder, um das Formular zu erstellen.
   * @param http - Der HTTP-Client, um API-Anfragen zu senden.
   * @param authService - Der Authentifizierungsdienst, um die Auth-Header zu erhalten.
   * @param dialogRef - Referenz auf das Dialogfenster.
   * @param data - Die übergebenen Daten, einschließlich der Kurs-ID.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    protected dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialisiert das Formular mit einer Pflichtfeldvalidierung für die Studenten-ID
    this.form = this.fb.group({
      studentId: ['', Validators.required]  // Validierung für StudentenId
    });
  }

  /**
   * Sucht einen Studenten anhand der eingegebenen Studenten-ID.
   * Zeigt den Namen des Studenten an, wenn er gefunden wird, oder eine Fehlermeldung, wenn nicht.
   *
   * @returns {void}
   */
  searchStudent(): void {
    const studentId = this.form.get('studentId')?.value;
    this.http.get<any>(`http://localhost:8080/api/private/v1/student/${studentId}`,
      { headers: this.authService.getAuthHeaders() }).subscribe({
      next: (student) => {
        this.studentName = student.name;
        this.error = null;
      },
      error: () => {
        this.studentName = null;
        this.error = 'Student nicht gefunden';
      }
    });
  }

  /**
   * Fügt den gefundenen Studenten dem Kurs hinzu.
   * Zeigt eine Erfolgsnachricht oder Fehlermeldung je nach Ergebnis an.
   *
   * @returns {void}
   */
  addStudent(): void {
    // Setzt alle Meldungen zurück
    this.error = '';
    this.successMessage = '';

    const studentId = this.form.get('studentId')?.value;

    // Anfrage, um den Studenten hinzuzufügen
    this.http.post(`http://localhost:8080/api/private/v1/course/${this.data.courseId}/student/${studentId}`, {},
      { headers: this.authService.getAuthHeaders(), responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          // Student erfolgreich hinzugefügt
          console.log('Student erfolgreich hinzugefügt:', response);
          this.successMessage = "Student wurde erfolgreich hinzugefügt";
        },
        error: (err) => {
          // Fehlerbehandlung
          console.error('Fehler beim Hinzufügen des Studenten:', err);

          // Fehlermeldung je nach HTTP-Status
          if (err.status === 409) {
            this.error = 'Student existiert bereits';
          } else if (err.status === 404) {
            this.error = 'Student nicht gefunden';
          } else if (err.status === 400) {
            this.error = 'Ungültige Eingabe';
          } else if (err.status === 401) {
            this.error = 'Nicht Autorisiert';
          } else {
            this.error = 'Unbekannter Fehler ist aufgetreten';
          }
        }
      });
  }
}
