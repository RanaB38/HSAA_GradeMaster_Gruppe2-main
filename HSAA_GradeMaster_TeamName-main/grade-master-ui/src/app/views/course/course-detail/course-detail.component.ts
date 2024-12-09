import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import {Course} from "../../../../lib/domain/course.interfaces";
import {MaterialColor} from "../../../../lib/enums/material-color";
import {Observable} from "rxjs";
import {Student} from "../../../../lib/domain/student.interfaces";
import {CourseCoreService} from "../../../../lib/core-services/course-core.service";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";


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

  constructor(
    private courseCoreService: CourseCoreService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.ngOnInit()
    this.http.get("http://localhost:8080/api/v1/course/"+this.courseId).subscribe(c =>
      { console.log(c);}
    );
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = parseInt(<string>params.get('id'));
      this.loadCourseDetails();
      this.loadStudents();
    });
  }

  loadCourseDetails(): void {
    this.dataSource$ = this.courseCoreService.getCourse(this.courseId);
  }

  loadStudents(): void {
    this.students$ = this.http.get<Student[]>(`http://localhost:8080/api/v1/course/${this.courseId}/students`);
    console.log("Load students...");
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


}
