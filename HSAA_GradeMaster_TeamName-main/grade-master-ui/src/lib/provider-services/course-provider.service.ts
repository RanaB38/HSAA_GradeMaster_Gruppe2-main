import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Course } from "../domain/course.interfaces";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CourseProviderService {

  /** Subject für die Verwaltung der Kursliste */
  private coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);

  /** Observable, um Änderungen an der Kursliste zu verfolgen */
  public courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  /** Basis-URL für die Kurs-API */
  private baseUrl = 'http://localhost:8080/api/private/v1/course';

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private authService: AuthService) {
    this.loadCourses();
  }

  /**
   * Lädt die Liste der Kurse vom Server und aktualisiert das Subject.
   */
  private loadCourses(): void {
    this.httpClient.get<Course[]>(this.baseUrl, { headers: this.authService.getAuthHeaders() }).subscribe({
      next: (courses) => {
        this.coursesSubject.next(courses);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kurse:', err);
        this.snackBar.open('Fehler beim Laden der Kurse', 'Schließen', {
          duration: 3000,
        });
      }
    });
  }

  /**
   * Gibt alle verfügbaren Kurse zurück.
   * @returns {Observable<Course[]>} Ein Observable mit der Liste der Kurse.
   */
  public getAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.baseUrl, { headers: this.authService.getAuthHeaders() });
  }

  /**
   * Erstellt einen neuen Kurs und fügt ihn der aktuellen Liste hinzu.
   * @param {Course} course - Der zu erstellende Kurs.
   */
  public createCourse(course: Course): void {
    console.log('>>> ', course);

    this.httpClient.post<Course>(this.baseUrl, course, { headers: this.authService.getAuthHeaders() }).subscribe({
      next: (createdCourse) => {
        const currentCourses = this.coursesSubject.value;
        const updatedCourses = [...currentCourses, createdCourse]; // Neuen Kurs hinzufügen
        this.coursesSubject.next(updatedCourses);

        console.log('Aktualisierte Kursliste:', updatedCourses);
        this.snackBar.open('Kurs erfolgreich erstellt!', 'Schließen', {
          duration: 3000,
        });
      },
      error: (err) => {
        if (err.status === 409) { // Konfliktstatus
          console.error('Kurs existiert bereits:', err);
          this.snackBar.open('Dieser Kurs existiert bereits!', 'Schließen', {
            duration: 3000,
          });
        }
      }
    });
  }

  /**
   * Löscht einen Kurs anhand der ID.
   * (Aktuell nur Platzhalter, ohne Serverkommunikation)
   * @param {string} courseId - Die ID des zu löschenden Kurses.
   */
  public deleteCourse(courseId: string): void {
    console.log('>>> Deleting course with ID: ', courseId);
    // Hier könnte Logik zum Löschen des Kurses hinzugefügt werden
  }

  /**
   * Gibt einen Kurs anhand seiner ID zurück.
   * @param {number} id - Die ID des gesuchten Kurses.
   * @returns {Course | undefined} Der gefundene Kurs oder undefined, falls nicht vorhanden.
   */
  public getCourseById(id: number): Course | undefined {
    const currentCourses = this.coursesSubject.getValue(); // Holt aktuelle Liste
    return currentCourses.find(course => course.id === id); // Filtert nach ID
  }
}
