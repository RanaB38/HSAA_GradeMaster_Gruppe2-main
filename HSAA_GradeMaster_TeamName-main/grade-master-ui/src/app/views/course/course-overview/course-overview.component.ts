import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {Observable} from "rxjs";
import {Course} from "../../../../lib/domain/course.interfaces";
import {CourseCoreService} from "../../../../lib/core-services/course-core.service";
import {HttpClient} from "@angular/common/http";

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

  public dataSource$!: Observable<Course[]>; // "!" oder "... | undefined"

  constructor(private router: Router,
              private courseCoreService: CourseCoreService,
              private http: HttpClient,) {

    this.http.get("http://localhost:8080/api/v1/course").subscribe(s =>
      { console.log(s);}
    );
    this.dataSource$ = this.courseCoreService.getCourses();
    console.log(this.dataSource$);

  }
    public addCourse() {
      // Öffnen einer unabhängigen route, die auf jeder Seite angezeigt werden könnte.
      this.router.navigate([{ outlets: { dialog: ['dialog'] } }]);
    }


}

