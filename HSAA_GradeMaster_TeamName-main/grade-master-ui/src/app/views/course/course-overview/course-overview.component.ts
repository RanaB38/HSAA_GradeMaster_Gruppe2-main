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
import {AuthService} from "../../../../lib/provider-services/auth.service";

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
  styleUrl: './course-overview.component.scss'
})
export class CourseOverviewComponent {

  public dataSource$!: Observable<Course[]>;

  constructor(
    private router: Router,
    private courseCoreService: CourseCoreService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dataSource$ = this.courseCoreService.getCourses();
  }

  public addCourse() {
    this.router.navigate([{ outlets: { dialog: ['dialog'] } }]);
  }

  public editCourse(courseId: number): void {
    this.router.navigate([`/courses/${courseId}/edit`]);
  }

  public deleteCourse(courseId: number): void {
    if (confirm(`Möchten Sie den Kurs mit der ID ${courseId} wirklich löschen?`)) {
      this.http.delete(`http://localhost:8080/api/private/v1/course/${courseId}`,
        {headers: this.authService.getAuthHeaders()}).subscribe({
        next: () => {
          this.snackBar.open('Kurs erfolgreich gelöscht', 'OK', { duration: 3000 });
          this.dataSource$ = this.courseCoreService.getCourses(); // Aktualisieren
        },
        error: (err) => {
          this.snackBar.open('Fehler beim Löschen des Kurses', 'OK', { duration: 3000 });
          console.error('Fehler beim Löschen:', err);
        }
      });
    }
  }
}
