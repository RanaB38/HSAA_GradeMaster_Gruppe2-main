import { Injectable } from '@angular/core';
import { StudentProviderService } from '../provider-services/student-provider.service';
import { Student } from '../domain/student.interfaces';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentCoreService {

  private studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

  public students$: Observable<Student[]> = this.studentsSubject.asObservable();


  constructor(private providerService: StudentProviderService) {

    const students$ = this.providerService.getAllStudents()

    students$.subscribe(students => {
      this.studentsSubject.next(students);
    });

  }




  getStudents(): Observable<Student[]>  {
    return this.providerService.getAllStudents();
  }

  addStudent(newStudent = {id: 0, name: '', email: '' }) {
    this.providerService.createStudent({...newStudent}).subscribe(newStudent => {
      const currentStudents = this.studentsSubject.value;
      const updatedStudents = [...currentStudents, newStudent];
      //this.studentsSubject.next(updatedStudents);
      }
    );
  }

  getStudent(id: number): Student | undefined {
    return this.providerService.getStudentById(id);
  }

  getStudentData(id: number):Observable<Student> {
    return this.providerService.getStudentData(id);
  }

}

