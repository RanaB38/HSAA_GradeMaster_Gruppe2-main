import { Injectable } from '@angular/core';
import {CourseProviderService} from "../provider-services/course-provider.service";
import {Observable} from "rxjs";
import {Course} from "../domain/course.interfaces";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CourseCoreService {

  private apiUrl = '/api/private/v1/courses';

  constructor(
    private providerService: CourseProviderService,
    private http: HttpClient
    ) { }

  getCourses(): Observable<Course[]>  {
    return this.providerService.getAllCourses();
  }

  addCourse(newCourse = {id: 0, name: '', description: '' }) {
    this.providerService.createCourse({...newCourse}); // Workaround um neues object zu generieren
  }

  getCourse(id: number): Course | undefined {
    return this.providerService.getCourseById(id);
  }

  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}`);
  }

}
