import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../domain/student.interfaces';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class StudentProviderService {

  private studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  public students$: Observable<Student[]> = this.studentsSubject.asObservable();
  private baseUrl = 'http://localhost:8080/api/private/v1/student';

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.httpClient.get<Student[]>(this.baseUrl).subscribe({
      next: (students) => {
        this.studentsSubject.next(students);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Studenten:', err);
      }
    });
  }

  public getAllStudents(): Observable<Student[]> {
    return this.students$;
  }

  public createStudent(student: Student): void {
    console.log('>>> ', student);

    this.httpClient.post<Student>(this.baseUrl, student).subscribe({
      next: (createdStudent) => {
        const currentStudents = this.studentsSubject.value;
        const updatedStudents = [...currentStudents, createdStudent];
        this.studentsSubject.next(updatedStudents);

        console.log('Aktualisierte Studentenliste:', updatedStudents);
      },
      error: (err) => {
        if (err.status === 409) { // 409 Conflict
          this.snackBar.open('Dieser Student existiert bereits!', 'Schließen', {
            duration: 3000,
          });
        }
      }
    });
  }

  public getStudentById(id: number): Student | undefined {
    const currentStudents = this.studentsSubject.getValue();
    return currentStudents.find(student => student.id === id);
  }
}
