import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import { Course } from "../../../../lib/domain/course.interfaces";
import { MaterialColor } from "../../../../lib/enums/material-color";
import { Observable } from "rxjs";
import { Student } from "../../../../lib/domain/student.interfaces";
import { CourseCoreService } from "../../../../lib/core-services/course-core.service";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { Group } from "../../../../lib/domain/group.interfaces";
import { AddGroupDialogComponent } from "../add-group-dialog/add-group-dialog.component";
import { AuthService } from "../../../../lib/provider-services/auth.service";
import {StudentWithGrade} from "../../../../lib/domain/studentWithGrade.interface";

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
  public dataSource$!: Course | undefined;
  public title = 'Kurs Details';
  public color: MaterialColor = 'accent';
  public courseId!: number;
  public students$!: Observable<StudentWithGrade[]>;
  public groups: { id: number; name: string }[] = [];
  public groups$!: Observable<Group[]>;
  bewertungsschema: { topic: string; percentage: number }[] = [];
  isLecturer: boolean = false;

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
    this.students$ = this.http.get<StudentWithGrade[]>(`http://localhost:8080/api/private/v1/course/${this.courseId}/students`,
      { headers: this.authService.getAuthHeaders() });
    console.log("Load students...");
  }

  loadGroups(): void {
    this.groups$ = this.http.get<Group[]>(`http://localhost:8080/api/private/v1/groups/course/${this.courseId}`,
      { headers: this.authService.getAuthHeaders() });
    console.log("Load groups...");
  }

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

  onSelectGroup(group: Group): void {
    this.router.navigate(['/courses', this.courseId, 'groups', group.id, 'details']);
  }

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

  checkUserRole(): void {
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log('User role:', this.isLecturer ? 'Lecturer' : 'Student');
  }

  navigateToEditBewertungsschema(): void {
    this.router.navigate([`/courses/${this.courseId}/bewertungsschema`]);
  }

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
