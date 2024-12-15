import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
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

    if (this.form.invalid) {
      this.errorMessage = 'Name darf nicht leer sein';
      return;
    }

    const groupName = this.form.get('groupName')?.value;

    this.errorMessage = null; // Vorherige Fehlermeldung zurücksetzen

    this.http.post(`http://localhost:8080/api/v1/groups/course/${this.data.courseId}`, { name: groupName })
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true, message: 'Gruppe wurde erfolgreich hinzugefügt.' });
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'Name darf nicht leer sein';
          } else if (err.status === 409) {
            this.errorMessage = 'Diese Gruppe existiert bereits';
          } else {
            this.errorMessage = 'Unbekannter Fehler beim Hinzufügen der Gruppe';
          }
        }
      });
  }
}
