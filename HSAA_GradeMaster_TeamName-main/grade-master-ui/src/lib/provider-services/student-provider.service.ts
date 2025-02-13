import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../domain/student.interfaces';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentProviderService {

  /**
   * BehaviorSubject zur Speicherung und Verwaltung der Studenten-Daten.
   * Wird mit einem leeren Array initialisiert.
   */
  private studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

  /**
   * Observable, um Änderungen an der Studentenliste zu verfolgen.
   */
  public students$: Observable<Student[]> = this.studentsSubject.asObservable();

  /** Basis-URL für den Studenten-API-Endpunkt */
  private baseUrl = 'http://localhost:8080/api/private/v1/student';

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.loadStudents();
  }

  /**
   * Lädt die Liste der Studenten vom Server und aktualisiert das Subject.
   */
  private loadStudents(): void {
    this.httpClient.get<Student[]>(this.baseUrl, { headers: this.authService.getAuthHeaders() }).subscribe({
      next: (students) => {
        this.studentsSubject.next(students);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Studenten:', err);
      }
    });
  }

  /**
   * Gibt ein Observable mit der aktuellen Studentenliste zurück.
   * @returns {Observable<Student[]>} Observable mit der Liste aller Studenten.
   */
  public getAllStudents(): Observable<Student[]> {
    return this.students$;
  }

  /**
   * Erstellt einen neuen Studenten und fügt ihn der Liste hinzu.
   * @param {Student} student - Der zu erstellende Student.
   * @returns {Observable<Student>} Observable des erstellten Studenten.
   */
  public createStudent(student: Student): Observable<Student> {
    return this.httpClient.post<Student>(this.baseUrl, student, { headers: this.authService.getAuthHeaders() }).pipe(
      tap({
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
      })
    );
  }

  /**
   * Sucht einen Studenten anhand der ID in der aktuellen Liste.
   * @param {number} id - Die ID des gesuchten Studenten.
   * @returns {Student | undefined} Der gefundene Student oder undefined, falls nicht gefunden.
   */
  public getStudentById(id: number): Student | undefined {
    const currentStudents = this.studentsSubject.getValue();
    return currentStudents.find(student => student.id === id);
  }

  /**
   * Ruft die vollständigen Daten eines Studenten vom Server ab.
   * @param {number} id - Die ID des Studenten.
   * @returns {Observable<Student>} Observable mit den Studentendaten.
   */
  public getStudentData(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${this.baseUrl}/data/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}
