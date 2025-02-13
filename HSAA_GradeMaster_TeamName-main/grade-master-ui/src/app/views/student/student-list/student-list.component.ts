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
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthService } from "../../../../lib/provider-services/auth.service";

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

  // "$" als Konvention zur Kennzeichnung von Observables
  public dataSource$!: Observable<Student[]>;

  // Definiert die anzuzeigenden Spalten in der Tabelle
  public displayedColumns: string[] = ['id', 'name', 'email'];

  /**
   * Erstellt eine Instanz der StudentListComponent.
   * @param {MatDialog} dialog - Service zur Anzeige von Dialogen.
   * @param {StudentCoreService} studentCoreService - Service zur Verwaltung von Studentendaten.
   * @param {Router} router - Router für die Navigation zwischen Seiten.
   * @param {HttpClient} http - HTTP-Client für API-Anfragen.
   * @param {AuthService} authService - Service für Authentifizierung und Benutzerverwaltung.
   */
  constructor(
    private dialog: MatDialog,
    private studentCoreService: StudentCoreService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Lädt die Studentendaten aus dem Service
    this.dataSource$ = this.studentCoreService.students$;
  }

  /**
   * Öffnet den Dialog zur Erstellung eines neuen Studenten.
   * Nach dem Schließen des Dialogs wird das Ergebnis verarbeitet.
   */
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

  /**
   * Navigiert zur Detailseite eines ausgewählten Studenten.
   * @param {Student} student - Der ausgewählte Student.
   */
  public onSelectStudent(student: Student): void {
    this.router.navigate(['/students', student.id, 'details']);
  }

}
