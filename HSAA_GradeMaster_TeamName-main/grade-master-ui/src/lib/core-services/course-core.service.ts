import { Injectable } from '@angular/core';
import { CourseProviderService } from '../provider-services/course-provider.service';
import { Observable } from 'rxjs';
import { Course } from '../domain/course.interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseCoreService {

  /** Basis-URL für API-Anfragen zu Kursen. */
  private apiUrl = '/api/private/v1/courses';

  /**
   * Konstruktor für den CourseCoreService.
   * @param providerService - Der Service für Datenzugriffe auf die Kursdaten.
   * @param http - HTTP-Client für API-Anfragen.
   */
  constructor(
    private providerService: CourseProviderService,
    private http: HttpClient
  ) {}

  /**
   * Ruft die Liste aller Kurse als Observable ab.
   * @returns {Observable<Course[]>} Ein Observable mit einer Liste von Kursen.
   */
  getCourses(): Observable<Course[]> {
    return this.providerService.getAllCourses();
  }

  /**
   * Fügt einen neuen Kurs hinzu.
   * @param newCourse - Das neue Kursobjekt (Standardwerte: id=0, name='', description='').
   */
  addCourse(newCourse = { id: 0, name: '', description: '' }) {
    this.providerService.createCourse({ ...newCourse }); // Erzeugt eine Kopie des neuen Kurses.
  }

  /**
   * Ruft einen bestimmten Kurs anhand der ID ab.
   * @param id - Die ID des Kurses.
   * @returns {Course | undefined} Der gefundene Kurs oder `undefined`, falls nicht vorhanden.
   */
  getCourse(id: number): Course | undefined {
    return this.providerService.getCourseById(id);
  }

  /**
   * Holt die detaillierten Informationen zu einem Kurs über die API.
   * @param courseId - Die ID des Kurses.
   * @returns {Observable<any>} Ein Observable mit den Kursdetails.
   */
  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}`);
  }

}
