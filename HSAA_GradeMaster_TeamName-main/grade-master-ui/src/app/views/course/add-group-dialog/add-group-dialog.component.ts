import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  standalone: true,
  styleUrls: ['./add-group-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AddGroupDialogComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false; // Flag, um den Button zu deaktivieren

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    protected dialogRef: MatDialogRef<AddGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {
    this.form = this.fb.group({
      groupName: ['', Validators.required] // Validierung für leere Gruppennamen
    });
  }

  addGroup(): void {
    const groupName = this.form.get('groupName')?.value.trim(); // Entferne Leerzeichen vom Anfang und Ende

    if (groupName.length === 0) {
      this.errorMessage = 'Name darf nicht leer sein';
      return;
    }

    this.errorMessage = null; // Vorherige Fehlermeldung zurücksetzen
    this.isLoading = true; // Setze isLoading auf true, um den Button zu deaktivieren

    this.http.post(`http://localhost:8080/api/private/v1/groups/course/${this.data.courseId}`, { name: groupName }, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false; // Anfragen abgeschlossen, Button wieder aktivieren
          // Erfolgsnachricht direkt aus der Textantwort
          this.dialogRef.close({ success: true, message: response });
        },
        error: (err) => {
          this.isLoading = false; // Fehlerbehandlung: Button wieder aktivieren

          // Fehlerprotokollierung für detaillierte Untersuchung
          console.error('Fehler beim Hinzufügen der Gruppe:', err); // Fehler loggen für eine genauere Analyse

          // Fehlerbehandlung für spezifische Backend-Fehler
          if (err.status === 409) {
            // Fehlerbehandlung für Konflikte: Gruppe existiert bereits
            this.errorMessage = 'Diese Gruppe existiert bereits im Kurs.';
          } else if (err.status === 500) {
            // Fehlerbehandlung für Serverfehler
            this.errorMessage = '';
          } else {
            // Allgemeine Fehlerbehandlung
            try {
              const errorBody = err.error ? JSON.stringify(err.error) : 'Unbekannter Fehler';
              this.errorMessage = `Unbekannter Fehler: ${errorBody}`;
            } catch (e) {
              this.errorMessage = `Unbekannter Fehler beim Parsen der Antwort.`;
            }
          }
        }
      });
  }
}
