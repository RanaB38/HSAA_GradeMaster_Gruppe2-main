import { Injectable } from '@angular/core';
import {CourseProviderService} from "../provider-services/course-provider.service";
import {Observable} from "rxjs";
import {Course} from "../domain/course.interfaces";

@Injectable({
  providedIn: 'root'
})
export class CourseCoreService {

  constructor(private providerService: CourseProviderService) { }

  getCourses(): Observable<Course[]>  {
    return this.providerService.getAllCourses();
  }

  addCourse(newCourse = {id: 0, name: '', description: '' }) {
    this.providerService.createCourse({...newCourse}); // Workaround um neues object zu generieren
  }

  getCourse(id: number): Course | undefined {
    return this.providerService.getCourseById(id);
  }

}
