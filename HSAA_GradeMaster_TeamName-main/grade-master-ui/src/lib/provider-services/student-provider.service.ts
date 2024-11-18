import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../domain/student.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StudentProviderService {

  
  // Internes BehaviorSubject zum Verwalten der Student-Liste
  private studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  
  // Observable, das abonniert werden kann, um die aktuelle Student-Liste zu erhalten
  // Subjects sollten nie driekt rausgegeben werden -> Manipulationsgefahr 
  public students$: Observable<Student[]> = this.studentsSubject.asObservable();
  
  constructor() {

    // Initialisierung im Konstruktor, wäre in "ngOnInit()" ebenfalls möglich
    const initialStudents: Student[] = [
      { id: 1, name: 'Hans', email: 'hans@test.de' },
      { id: 2, name: 'Helmut', email: 'helmut@test.de' },
      { id: 3, name: 'Friedrich', email: 'friedrich@test.de' },
      { id: 4, name: 'Josef', email: 'josef@test.de' },
    ];
    this.studentsSubject.next(initialStudents);

   }


  // GET Students
  public getAllStudents(): Observable<Student[]> {
    return this.students$;
  }

  // POST Student
  public createStudent(student: Student): void {

    console.log('>>> ', student);

    const currentStudents = this.studentsSubject.value;
    const updatedStudents = [...currentStudents, student]; // Neuen Studenten hinzufügen; Spread-Operator
    this.studentsSubject.next(updatedStudents);

    console.log('Aktualisierte Studentenliste:', updatedStudents);
  }

  public getStudentById(id: number): Student | undefined {
    const currentStudents = this.studentsSubject.getValue(); // Holt aktuelle Liste
    return currentStudents.find(student => student.id === id); // Filtert nach ID
  }


}
