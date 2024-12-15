import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Course } from "../domain/course.interfaces";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CourseProviderService {

  private coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  public courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  private baseUrl = 'http://localhost:8080/api/v1/course';

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.httpClient.get<Course[]>(this.baseUrl).subscribe({
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

  public getAllCourses(): Observable<Course[]> {
    return this.courses$;
  }

  public createCourse(course: Course): void {
    console.log('>>> ', course);

    this.httpClient.post<Course>(this.baseUrl, course).subscribe({
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

  public deleteCourse(courseId: string): void {
    console.log('>>> Deleting course with ID: ', courseId);
    // Hier könnte Logik zum Löschen des Kurses hinzugefügt werden
  }

  public getCourseById(id: number): Course | undefined {
    const currentCourses = this.coursesSubject.getValue(); // Holt aktuelle Liste
    return currentCourses.find(course => course.id === id); // Filtert nach ID
  }
}
