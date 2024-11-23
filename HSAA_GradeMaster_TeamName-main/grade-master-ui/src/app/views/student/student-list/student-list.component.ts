import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentCoreService } from '../../../../lib/core-services/student-core.service';
import { Student } from '../../../../lib/domain/student.interfaces';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import {HttpClient, HttpClientModule, provideHttpClient} from "@angular/common/http";

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {

  // "$" als inoffizielle Coding-Konvention um Observables zu markieren
  public dataSource$!: Observable<Student[]>; // "!" oder "... | undefined"
  public displayedColumns: string[] = ['id', 'name', 'email'];

  constructor(
    private dialog: MatDialog,
    private studentCoreService: StudentCoreService,
    private router: Router,
    private http: HttpClient,
  ) {
  this.http.get("http://localhost:8080/api/v1/student").subscribe(s =>
  { console.log(s);}
  );
    this.dataSource$ = this.studentCoreService.getStudents();
  }

  public addStudent(): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Formulardaten:', result);
      } else {
        console.log('Dialog abgebrochen');
      }
    });
  }

  public onSelectStudent(student: Student): void {
    this.router.navigate(['/students', student.id, 'details']); // Navigiere zur Detailseite
  }

}
