import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from "rxjs";
import { Course } from "../../../../lib/domain/course.interfaces";
import { CourseCoreService } from "../../../../lib/core-services/course-core.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../../../lib/provider-services/auth.service";

/**
 * Komponente für die Kursübersicht.
 *
 * Diese Komponente zeigt eine Übersicht der Kurse und ermöglicht das Hinzufügen, Bearbeiten und Löschen von Kursen.
 */
@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent {

  /**
   * Observable zur Anzeige der Liste der Kurse.
   */
  public dataSource$!: Observable<Course[]>;

  /**
   * Erstellt eine Instanz der CourseOverviewComponent.
   *
   * @param router - Router zur Navigation zwischen verschiedenen Routen.
   * @param courseCoreService - Service zur Verwaltung von Kursen.
   * @param http - HttpClient zur Kommunikation mit dem Backend.
   * @param snackBar - Snackbar für Benachrichtigungen.
   * @param authService - Authentifizierungs-Service.
   */
  constructor(
    private router: Router,
    private courseCoreService: CourseCoreService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    // Kurse initial laden
    this.dataSource$ = this.courseCoreService.getCourses();
  }

  /**
   * Navigiert zur Dialogansicht, um einen neuen Kurs hinzuzufügen.
   */
  public addCourse() {
    this.router.navigate([{ outlets: { dialog: ['dialog'] } }]);
  }

  /**
   * Navigiert zur Bearbeitungsansicht für einen Kurs.
   *
   * @param courseId - ID des zu bearbeitenden Kurses.
   */
  public editCourse(courseId: number): void {
    this.router.navigate([`/courses/${courseId}/edit`]);
  }

  /**
   * Löscht einen Kurs nach Bestätigung des Benutzers.
   *
   * @param courseId - ID des zu löschenden Kurses.
   */
  public deleteCourse(courseId: number): void {
    if (confirm(`Möchten Sie den Kurs mit der ID ${courseId} wirklich löschen?`)) {
      this.http.delete(`http://localhost:8080/api/private/v1/course/${courseId}`,
        { headers: this.authService.getAuthHeaders() }).subscribe({
        next: () => {
          this.snackBar.open('Kurs erfolgreich gelöscht', 'OK', { duration: 3000 });
          this.dataSource$ = this.courseCoreService.getCourses(); // Liste der Kurse aktualisieren
        },
        error: (err) => {
          this.snackBar.open('Fehler beim Löschen des Kurses', 'OK', { duration: 3000 });
          console.error('Fehler beim Löschen:', err);
        }
      });
    }
  }
}
