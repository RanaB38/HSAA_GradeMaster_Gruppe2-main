import { Component } from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatCardContent} from "@angular/material/card";
import {Course} from "../../../../lib/domain/course.interfaces";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CourseCoreService} from "../../../../lib/core-services/course-core.service";
import {MaterialColor} from "../../../../lib/enums/material-color";
import {MatToolbar} from "@angular/material/toolbar";
import {Observable} from "rxjs";
import {Student} from "../../../../lib/domain/student.interfaces";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatDialogClose} from "@angular/material/dialog";

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatCardContent,
    MatToolbar,
    NgForOf,
    ReactiveFormsModule,
    MatFormField,
    MatDialogClose
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {
  public dataSource$!: Course | undefined; // "!" oder "... | undefined"
  public title = 'Kurs Details';
  public color: MaterialColor = 'accent';
  public courseId!: number;
  public students$!: Observable<Student[]>; //neu

  constructor(
    private courseCoreService: CourseCoreService,
    private route: ActivatedRoute,
    private http: HttpClient,
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
      this.loadStudents();  //neu
    });
  }

  loadCourseDetails(): void {
    this.dataSource$ = this.courseCoreService.getCourse(this.courseId);
  }

  loadStudents(): void {
    this.students$ = this.http.get<Student[]>(`http://localhost:8080/api/v1/course/${this.courseId}/students`);
  }

}
