import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule } from '@angular/forms';
import {AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import {Course} from "../../../../lib/domain/course.interfaces";
import {MaterialColor} from "../../../../lib/enums/material-color";
import {Observable} from "rxjs";
import {Student} from "../../../../lib/domain/student.interfaces";
import {CourseCoreService} from "../../../../lib/core-services/course-core.service";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
// @ts-ignore
import {Group} from "../../../../lib/domain/group.interfaces";
import {AddGroupDialogComponent} from "../add-group-dialog/add-group-dialog.component";
import {AuthService} from "../../../../lib/provider-services/auth.service";


@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    AddStudentDialogComponent,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    MatButton,
    MatList,
    MatListItem,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})

export class CourseDetailComponent {
  public dataSource$!: Course | undefined;
  public title = 'Kurs Details';
  public color: MaterialColor = 'accent';
  public courseId!: number;
  public students$!: Observable<Student[]>;
  public groups: { id: number; name: string }[] = [];
  public groups$!: Observable<Group[]>;

  bewertungsschema: { topic: string; percentage: number }[] = [];
  isLecturer: boolean = false;

  constructor(
    private courseCoreService: CourseCoreService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private router : Router,
    private authService: AuthService
  ) {
    this.ngOnInit()
    this.http.get("http://localhost:8080/api/private/v1/course/"+this.courseId,
      {headers: authService.getAuthHeaders()}).subscribe(c =>
      { console.log(c);}
    );
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
  }
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

  loadCourseDetails(): void {
    this.dataSource$ = this.courseCoreService.getCourse(this.courseId);
  }

  loadStudents(): void {
    this.students$ = this.http.get<Student[]>(`http://localhost:8080/api/private/v1/course/${this.courseId}/students`,
      {headers: this.authService.getAuthHeaders()});
    console.log("Load students...");
  }

  loadGroups(): void {
    this.groups$ = this.http.get<Group[]>(`http://localhost:8080/api/private/v1/groups/course/${this.courseId}`,
      {headers: this.authService.getAuthHeaders()});
    console.log("Load groups...");
  }

  // Methode, um den Dialog zu öffnen, Sprint 3 Aufgabe 10
  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px',
      data: { courseId: this.courseId }  // KursId wird an den Dialog übergeben
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents();  // Wenn der Dialog mit "Hinzufügen" geschlossen wurde, Studenten neu laden
      }
    });
  }

  //Sprint 3 - Aufgabe 11
  openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log(result.message); // Erfolgsnachricht wird angezeigt
        this.loadGroups(); // Gruppenliste neu laden
      } else {
        console.log('Dialog geschlossen ohne Erfolg.');
      }
    });
  }

  //Sprint 3 - Aufgabe 12
  onSelectGroup(group: Group): void {
    this.router.navigate(['/courses', this.courseId, 'groups', group.id, 'details']);
  }

  //Aufgabe 15 - Sprint 4
  loadBewertungsschema(courseId: number | null): void {
    console.log('Lade Bewertungsschema für Kurs:', courseId);
    this.http
      .get<{ topic: string; percentage: number }[]>(
        `http://localhost:8080/api/private/v1/bewertungsschema/course/${courseId}`,
        {headers: this.authService.getAuthHeaders()}
      )
      .subscribe((data) => {
          console.log('Bewertungsschema geladen:', data);
          this.bewertungsschema = data;
        },
        (error) => {
          console.error('Fehler beim Laden des Bewertungsschemas:', error);
        }
      );
  }

  checkUserRole(): void {
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log('Benutzerrolle:', this.isLecturer ? 'Lecturer' : 'Student');
  }

  navigateToEditBewertungsschema(): void {
    this.router.navigate([`/courses/${this.courseId}/bewertungsschema`]);
  }

  private setUserRole() {
    console.log(this.authService.getUserRole());
    if (this.authService.getUserRole() != 'LECTURER') {
      this.isLecturer = false;
      console.log("Student")
    } else {
      this.isLecturer = true;
      console.log("Lecturer")
    }
  }
}
