import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import { Course } from "../../../../lib/domain/course.interfaces";
import { MaterialColor } from "../../../../lib/enums/material-color";
import { Observable } from "rxjs";
import { CourseCoreService } from "../../../../lib/core-services/course-core.service";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { Group } from "../../../../lib/domain/group.interfaces";
import { AddGroupDialogComponent } from "../add-group-dialog/add-group-dialog.component";
import { AuthService } from "../../../../lib/provider-services/auth.service";
import { StudentWithGrade } from "../../../../lib/domain/studentWithGrade.interface";

/**
 * Komponente für die Kurs-Detailseite, die Kursinformationen, Studenten,
 * Gruppen und Bewertungsschema anzeigt und die Möglichkeit bietet,

 * Studenten und Gruppen hinzuzufügen sowie das Bewertungsschema zu bearbeiten.
 *
 * @component
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    MatButton,
    RouterOutlet,
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})

export class CourseDetailComponent {

  /** Der Kurs, dessen Details angezeigt werden. */
  public dataSource$!: Course | undefined;

  /** Der Titel der Seite. */
  public title = 'Kurs Details';

  /** Die Farbe für Material Design Komponenten. */
  public color: MaterialColor = 'accent';

  /** Die ID des Kurses. */
  public courseId!: number;

  /** Eine Observable, die die Studenten des Kurses mit Noten enthält. */
  public students$!: Observable<StudentWithGrade[]>;

  /** Die Gruppen des Kurses. */
  public groups: { id: number; name: string }[] = [];

  /** Eine Observable, die die Gruppen des Kurses enthält. */
  public groups$!: Observable<Group[]>;

  /** Das Bewertungsschema des Kurses. */
  bewertungsschema: { topic: string; percentage: number }[] = [];

  /** Gibt an, ob der aktuelle Benutzer ein Dozent ist. */
  isLecturer: boolean = false;

  /**
   * Erzeugt eine Instanz der CourseDetailComponent.
   *
   * @param courseCoreService - Der Service für Kursbezogene Operationen.
   * @param route - Der Aktive Routen-Parameter.
   * @param http - Der HTTP-Client für API-Anfragen.
   * @param dialog - Der Dialog-Service für Dialoge.
   * @param router - Der Router für Navigation.
   * @param authService - Der Authentifizierungsdienst zur Bestimmung der Benutzerrolle.
   */
  constructor(
    private courseCoreService: CourseCoreService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {
    this.ngOnInit();
    this.http.get("http://localhost:8080/api/private/v1/course/" + this.courseId,
      { headers: authService.getAuthHeaders() }).subscribe(c => {
      console.log(c);
    });
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
  }

  /**
   * Initialisiert die Komponente und lädt Kursdetails, Studenten, Gruppen und das Bewertungsschema.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = parseInt(<string>params.get('id'));
      this.loadCourseDetails();
      this.loadStudents();
      this.loadGroups();
      this.loadBewertungsschema(this.courseId);
      this.checkUserRole();
      this.setUserRole();
    });
  }

  /**
   * Lädt die Kursdetails für den angegebenen Kurs.
   *
   * @returns {void}
   */
  loadCourseDetails(): void {
    this.dataSource$ = this.courseCoreService.getCourse(this.courseId);
  }

  /**
   * Lädt die Liste der Studenten im Kurs.
   *
   * @returns {void}
   */
  loadStudents(): void {
    this.students$ = this.http.get<StudentWithGrade[]>(`http://localhost:8080/api/private/v1/course/${this.courseId}/students`,
      { headers: this.authService.getAuthHeaders() });
    console.log("Load students...");
  }

  /**
   * Lädt die Gruppen im Kurs.
   *
   * @returns {void}
   */
  loadGroups(): void {
    this.groups$ = this.http.get<Group[]>(`http://localhost:8080/api/private/v1/groups/course/${this.courseId}`,
      { headers: this.authService.getAuthHeaders() });
    console.log("Load groups...");
  }

  /**
   * Öffnet einen Dialog zum Hinzufügen eines Studenten.
   *
   * @returns {void}
   */
  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();  // Reload students after adding
      }
    });
  }

  /**
   * Öffnet einen Dialog zum Hinzufügen einer Gruppe.
   *
   * @returns {void}
   */
  openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log(result.message);
        this.loadGroups(); // Reload groups after adding
      } else {
        console.log('Dialog closed without success.');
      }
    });
  }

  /**
   * Navigiert zur Detailseite einer Gruppe.
   *
   * @param group - Die ausgewählte Gruppe.
   * @returns {void}
   */
  onSelectGroup(group: Group): void {
    this.router.navigate(['/courses', this.courseId, 'groups', group.id, 'details']);
  }

  /**
   * Lädt das Bewertungsschema für den Kurs.
   *
   * @param courseId - Die ID des Kurses.
   * @returns {void}
   */
  loadBewertungsschema(courseId: number | null): void {
    console.log('Loading evaluation scheme for course:', courseId);
    this.http
      .get<{ topic: string; percentage: number }[]>(
        `http://localhost:8080/api/private/v1/bewertungsschema/course/${courseId}`,
        { headers: this.authService.getAuthHeaders() }
      )
      .subscribe((data) => {
          console.log('Evaluation scheme loaded:', data);
          this.bewertungsschema = data;
        },
        (error) => {
          console.error('Error loading evaluation scheme:', error);
        }
      );
  }

  /**
   * Überprüft die Benutzerrolle und stellt fest, ob der Benutzer ein Dozent ist.
   *
   * @returns {void}
   */
  checkUserRole(): void {
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log('User role:', this.isLecturer ? 'Lecturer' : 'Student');
  }

  /**
   * Navigiert zur Bearbeitungsseite des Bewertungsschemas.
   *
   * @returns {void}
   */
  navigateToEditBewertungsschema(): void {
    this.router.navigate([`/courses/${this.courseId}/bewertungsschema`]);
  }

  /**
   * Setzt die Benutzerrolle des aktuellen Benutzers.
   *
   * @returns {void}
   */
  private setUserRole() {
    console.log(this.authService.getUserRole());
    if (this.authService.getUserRole() !== 'LECTURER') {
      this.isLecturer = false;
      console.log("Student");
    } else {
      this.isLecturer = true;
      console.log("Lecturer");
    }
  }

  /**
   * Löscht einen Studenten basierend auf seiner ID.
   *
   * @param studentId - Die ID des zu löschenden Studenten.
   * @returns {void}
   */
  deleteStudent(studentId: number): void {
    this.http.delete(`http://localhost:8080/api/private/v1/student/${studentId}`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe(
      () => {
        this.loadStudents(); // Reload students after deletion
      },
      (error) => {
        console.error('Error deleting student:', error);
      }
    );
  }
}
