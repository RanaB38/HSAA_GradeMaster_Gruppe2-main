import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {CourseCoreService} from "../../../../lib/core-services/course-core.service";

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
  ],
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coreService: CourseCoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

  }

  onSubmit() {
    // Prüfen ob Formular in einem "valid" state is
    if (this.form.valid) {
      // Daten verarbeiten
      const formData = this.form.value;
      console.log('Formulardaten verarbeitet:', formData);

      this.coreService.addCourse(formData);

      // Dialog schließen und Daten zurückgeben
      this.dialogRef.close(formData);
    } else {
      console.log('Formular ungültig');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
