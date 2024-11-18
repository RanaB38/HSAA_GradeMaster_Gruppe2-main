import { Injectable } from '@angular/core';
import { StudentProviderService } from '../provider-services/student-provider.service';
import { Student } from '../domain/student.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentCoreService {

  constructor(private providerService: StudentProviderService) { }

  getStudents(): Observable<Student[]>  {
    return this.providerService.getAllStudents();
  }

  addStudent(newStudent = { name: '', email: '' }) {
    this.providerService.createStudent({...newStudent, id: 0}); // Workaround um neues object zu generieren
  }

  // 
  getStudent(id: number): Student | undefined {
    return this.providerService.getStudentById(id);
  }

}

