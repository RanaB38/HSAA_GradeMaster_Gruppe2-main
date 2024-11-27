import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../domain/course.interfaces";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CourseProviderService {

  private coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);


  public courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  private baseUrl = 'http://localhost:8080/api/v1/course';

  constructor(private httpClient: HttpClient) {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.httpClient.get<Course[]>(this.baseUrl).subscribe({
      next: (courses) => {
        this.coursesSubject.next(courses);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kurse:', err);
      }
    });
  }

  // GET Kurse
  public getAllCourses(): Observable<Course[]> {
    return this.courses$;
  }

  // DELETE KURS
  public deleteCourse(courseId: string): void {
      console.log('>>> Deleting course with ID: ', courseId);
      // Hier könnte Logik zum Löschen des Kurses hinzugefügt werden, z.B.:
      // this.courseService.delete(courseId);
    }



  // POST Kurs
  public createCourse(course: Course): void {
    console.log('>>> ', course);



    // POST Kurs
    this.httpClient.post<Course>(this.baseUrl, course).subscribe({
      next: (createdCourse) => {
        const currentCourses = this.coursesSubject.value;
        const updatedCourses = [...currentCourses, createdCourse]; // Neuen Kurs hinzufügen
        this.coursesSubject.next(updatedCourses);

        console.log('Aktualisierte Kursliste:', updatedCourses);
      },
      error: (err) => {
        console.error('Fehler beim Erstellen des Kurses:', err);
      }
    });
  }

  public getCourseById(id: number): Course | undefined {
    const currentCourses = this.coursesSubject.getValue(); // Holt aktuelle Liste
    return currentCourses.find(course => course.id === id); // Filtert nach ID
  }
}
