import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-add-student-dialog',
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
    form: FormGroup;
    studentName: string | null = null;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        protected dialogRef: MatDialogRef<AddStudentToGroupDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            studentId: ['', Validators.required]  // Validierung für StudentenId
        });
    }

    // Methode, um den Studenten zu suchen
    searchStudent(): void {
        const studentId = this.form.get('studentId')?.value;
        this.http.get<any>(`http://localhost:8080/api/private/v1/student/${studentId}`).subscribe({
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



    // Methode, um den gefundenen Studenten zum Kurs hinzuzufügen
    successMessage: any;
    addStudent(): void {
        // Zuerst alle Meldungen zurücksetzen
        this.error = '';
        this.successMessage = '';

        const studentId = this.form.get('studentId')?.value;


        // Anfrage, um den Studenten hinzuzufügen
        this.http.post(`http://localhost:8080/api/private/v1/groups/${this.data.groupId}/add-student/${studentId}`, {}, { responseType: 'text' })
            .subscribe({
                next: (response: string) => {
                    // Student erfolgreich hinzugefügt
                    console.log('Student erfolgreich hinzugefügt:', response);
                    this.successMessage = "Student wurde erfolgreich Hinzugefügt";

                },
                error: (err) => {
                    // Fehlerbehandlung
                    console.error('Fehler beim Hinzufügen des Studenten:', err);

                    // Fehlermeldung je nach HTTP_Status
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
