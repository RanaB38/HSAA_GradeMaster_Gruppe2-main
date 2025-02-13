import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentCoreService } from '../../../../lib/core-services/student-core.service';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent {

  // Gibt an, ob der gesuchte Student gefunden wurde
  isStudentFound: boolean = false;

  // Speichert eine Fehlermeldung, falls der Student nicht gefunden wird
  errorMessage: string = '';

  // Formular für die Studenteneingabe
  form: FormGroup;

  /**
   * Erstellt eine Instanz des StudentDialogComponents.
   * @param {FormBuilder} fb - FormBuilder zur Erstellung des Formulars.
   * @param {MatDialogRef<StudentDialogComponent>} dialogRef - Referenz zum aktuellen Dialogfenster.
   * @param {StudentCoreService} coreService - Service zur Verwaltung von Studentendaten.
   */
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private coreService: StudentCoreService
  ) {

    // Initialisierung des Formulars mit Validierungen
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });

  }

  /**
   * Sucht einen Studenten anhand der eingegebenen ID.
   * Falls gefunden, werden die Daten in das Formular eingetragen.
   */
  searchStudent() {
    const idNumber = this.form.get('id')?.value;

    if (idNumber !== null && idNumber !== '') {
      this.coreService.getStudentData(idNumber).subscribe({
        next: (student) => {
          this.form.get('name')?.setValue(student.name);
          this.form.get('email')?.setValue(student.email);
          this.form.get('name')?.enable();
          this.form.get('email')?.enable();
          this.isStudentFound = true;
          this.errorMessage = '';
        },
        error: () => {
          // Fehlerbehandlung, wenn kein Student gefunden wurde
          this.isStudentFound = false;
          this.errorMessage = "Es wurde kein Student gefunden";
        }
      });
    }
  }

  /**
   * Verarbeitet das Formular beim Absenden.
   * Falls das Formular gültig ist, werden die Daten verarbeitet und der Dialog geschlossen.
   */
  onSubmit() {
    if (this.form.valid) {
      // Datenverarbeitung
      const formData = this.form.value;
      console.log('Formulardaten verarbeitet:', formData);

      this.coreService.addStudent(formData);

      // Dialog schließen und Daten zurückgeben
      this.dialogRef.close(formData);
    } else {
      console.log('Formular ungültig');
    }
  }

}
