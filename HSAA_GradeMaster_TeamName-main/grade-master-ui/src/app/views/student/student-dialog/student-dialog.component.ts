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
  isStudentFound: boolean = false;
  errorMessage: string = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private coreService: StudentCoreService
  ) {

    // Erstellen der Formulardaten -> "form" wird dann im template verknüpft
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });

  }

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
          // Fehler nicht gefunden
          this.isStudentFound = false;
          this.errorMessage = "Es wurde kein Student gefunden";
        }
      });
    }
  }

  onSubmit() {
    // Prüfen ob Formular in einem "valid" state is
    if (this.form.valid) {
      // Daten verarbeiten
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
