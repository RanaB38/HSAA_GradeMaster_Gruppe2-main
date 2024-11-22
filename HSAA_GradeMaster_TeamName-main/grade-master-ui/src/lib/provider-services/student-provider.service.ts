import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../domain/student.interfaces';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StudentProviderService {

  // Internes BehaviorSubject zum Verwalten der Student-Liste
  private studentsSubject: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

  // Observable, das abonniert werden kann, um die aktuelle Student-Liste zu erhalten
  // Subjects sollten nie driekt rausgegeben werden -> Manipulationsgefahr
  public students$: Observable<Student[]> = this.studentsSubject.asObservable();

  private baseUrl = 'http://localhost:8080/api/v1/student';

  constructor(private httpClient: HttpClient) {

    this.loadStudents();
    /* Initialisierung im Konstruktor, wäre in "ngOnInit()" ebenfalls möglich
    const initialStudents: Student[] = [
      { id: 1, name: 'Emre', email: 'hans@test.de' },
      { id: 2, name: 'Helmut', email: 'helmut@test.de' },
      { id: 3, name: 'Friedrich', email: 'friedrich@test.de' },
      { id: 4, name: 'Josef', email: 'josef@test.de' },
    ];
    this.studentsSubject.next(initialStudents);*/

   }

  private loadStudents(): void {
    this.httpClient.get<Student[]>(this.baseUrl).subscribe({
      next: (students) => {
        this.studentsSubject.next(students);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Studenten:', err);
      }
    });
  }

  // GET Students
  public getAllStudents(): Observable<Student[]> {
    return this.students$;
  }

  // POST Student
  public createStudent(student: Student): void {
    console.log('>>> ', student);

    // POST Student
    this.httpClient.post<Student>(this.baseUrl, student).subscribe({
      next: (createdStudent) => {
        const currentStudents = this.studentsSubject.value;
        const updatedStudents = [...currentStudents, createdStudent]; // Neuen Studenten hinzufügen
        this.studentsSubject.next(updatedStudents);

        console.log('Aktualisierte Studentenliste:', updatedStudents);
      },
      error: (err) => {
        console.error('Fehler beim Erstellen des Studenten:', err);
      }
    });
  }

  public getStudentById(id: number): Student | undefined {
    const currentStudents = this.studentsSubject.getValue(); // Holt aktuelle Liste
    return currentStudents.find(student => student.id === id); // Filtert nach ID
  }
}
