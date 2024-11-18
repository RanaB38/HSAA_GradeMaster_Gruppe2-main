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

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private coreService: StudentCoreService
  ) {

    // Erstellen der Formulardaten -> "form" wird dann im template verknüpft
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  
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
