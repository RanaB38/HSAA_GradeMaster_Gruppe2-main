import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from "../../../../lib/provider-services/auth.service";

/**
 * Component zum Hinzufügen einer Gruppe zu einem Kurs.
 *
 * @component
 */
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

  /** Das Formular zur Eingabe der Gruppennamen. */
  form: FormGroup;

  /** Fehlermeldung, die angezeigt wird, wenn ein Fehler auftritt. */
  errorMessage: string | null = null;

  /** Flag, das angibt, ob die Anfrage gerade läuft (Deaktiviert den Button). */
  isLoading: boolean = false;

  /**
   * Erzeugt eine Instanz des AddGroupDialogComponents.
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
    protected dialogRef: MatDialogRef<AddGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {
    // Initialisiert das Formular mit einem Pflichtfeld für den Gruppennamen
    this.form = this.fb.group({
      groupName: ['', Validators.required] // Validierung für leere Gruppennamen
    });
  }

  /**
   * Fügt eine neue Gruppe hinzu und sendet eine Anfrage an den Server.
   * Validiert den Gruppennamen und zeigt entsprechende Fehlermeldungen an.
   *
   * @returns {void}
   */
  addGroup(): void {
    const groupName = this.form.get('groupName')?.value.trim(); // Entfernt Leerzeichen vom Anfang und Ende

    if (groupName.length === 0) {
      this.errorMessage = 'Name darf nicht leer sein';
      return;
    }

    this.errorMessage = null; // Setzt die Fehlermeldung zurück
    this.isLoading = true; // Setzt isLoading auf true, um den Button zu deaktivieren

    this.http.post(`http://localhost:8080/api/private/v1/groups/course/${this.data.courseId}`, { name: groupName },
      { headers: this.authService.getAuthHeaders(), responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false; // Anfrage abgeschlossen, Button wird wieder aktiviert
          // Erfolgsnachricht direkt aus der Textantwort
          this.dialogRef.close({ success: true, message: response });
        },
        error: (err) => {
          this.isLoading = false; // Fehlerbehandlung: Button wird wieder aktiviert

          // Fehlerprotokollierung für detaillierte Untersuchung
          console.error('Fehler beim Hinzufügen der Gruppe:', err); // Fehler loggen

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
