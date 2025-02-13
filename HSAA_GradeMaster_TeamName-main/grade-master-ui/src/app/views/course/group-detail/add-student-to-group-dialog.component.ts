import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../lib/provider-services/auth.service';

/**
 * Komponente zum Hinzufügen eines Studenten zu einer Gruppe.
 * Diese Komponente ermöglicht die Eingabe einer Student-ID, die Suche nach einem Studenten und das Hinzufügen dieses Studenten zu einer Gruppe.
 */
@Component({
  selector: 'app-add-student-to-group-dialog',
  standalone: true,
  templateUrl: './add-student-to-group-dialog.component.html',
  styleUrls: ['./add-student-to-group-dialog.component.scss'],
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
export class AddStudentToGroupDialog {

  /**
   * Formular zur Eingabe der Student-ID.
   */
  form: FormGroup;

  /**
   * Name des gefundenen Studenten.
   */
  studentName: string | null = null;

  /**
   * Fehlermeldung im Falle eines Fehlers.
   */
  error: string | null = null;

  /**
   * Erfolgsnachricht nach dem Hinzufügen des Studenten.
   */
  successMessage: string | null = null;

  /**
   * Erstellt eine Instanz der AddStudentToGroupDialog-Komponente.
   *
   * @param fb - FormBuilder zum Erstellen des Formulars.
   * @param http - HttpClient zum Durchführen von HTTP-Anfragen.
   * @param dialogRef - Referenz zum Dialog, um ihn zu schließen.
   * @param authService - Authentifizierungsservice, um den aktuellen Benutzer zu validieren.
   * @param data - Daten, die beim Öffnen des Dialogs übergeben wurden (insbesondere die Gruppen-ID).
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    protected dialogRef: MatDialogRef<AddStudentToGroupDialog>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      studentId: ['', Validators.required]  // Validierung für die Eingabe der Student-ID
    });
  }

  /**
   * Sucht nach einem Studenten anhand der eingegebenen Student-ID.
   * Zeigt den Namen des Studenten an oder eine Fehlermeldung, wenn der Student nicht gefunden wird.
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
   * Fügt den gefundenen Studenten zur angegebenen Gruppe hinzu.
   * Gibt eine Erfolgsnachricht zurück oder eine spezifische Fehlermeldung je nach Fehlerstatus.
   */
  addStudent(): void {
    // Alle Meldungen zurücksetzen
    this.error = '';
    this.successMessage = '';

    const studentId = this.form.get('studentId')?.value;

    // Anfrage, um den Studenten hinzuzufügen
    this.http.post(`http://localhost:8080/api/private/v1/groups/${this.data.groupId}/add-student/${studentId}`, {},
      { headers: this.authService.getAuthHeaders(), responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          // Student erfolgreich hinzugefügt
          console.log('Student erfolgreich hinzugefügt:', response);
          this.successMessage = 'Student wurde erfolgreich hinzugefügt';
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
          } else {
            this.error = 'Unbekannter Fehler ist aufgetreten';
          }
        }
      });
  }
}
