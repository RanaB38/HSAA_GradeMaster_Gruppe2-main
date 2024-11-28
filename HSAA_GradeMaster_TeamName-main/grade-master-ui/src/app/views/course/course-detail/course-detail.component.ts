import { Component } from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatCardContent} from "@angular/material/card";
import {Observable} from "rxjs";
import {Course} from "../../../../lib/domain/course.interfaces";

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatCardContent
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {
  public dataSource$!: Observable<Course[]>; // "!" oder "... | undefined"



}
