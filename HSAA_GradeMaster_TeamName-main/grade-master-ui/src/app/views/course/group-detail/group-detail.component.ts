import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, RouterLink} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import {AsyncPipe} from "@angular/common";
import {group} from "@angular/animations";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {GroupDeleteDialogComponent} from "./group-delete-dialog.component";
import {AddStudentToGroupDialog} from "./add-student-to-group-dialog.component";
import {AuthService} from "../../../../lib/provider-services/auth.service";
import {GroupEvaluation} from "../../../../lib/domain/group-evaluation.inferface";
import {FormsModule} from "@angular/forms";
import {NotenspiegelProviderService} from "../../../../lib/provider-services/notenspiegel-provider.service";


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule,
    MatButtonModule,
    FormsModule
  ],
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  groupId!: number;
  courseId!: number;
  courseName!: string;
  group$!: Observable<any>;
  students$!: Observable<any[]>;
  evaluations: GroupEvaluation[] = [];
  overallEvaluation: any = {
    totalScore: 0,
    grade: 'Keine Note'
  };
  isLecturer: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private notenSpiegel: NotenspiegelProviderService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigating to:', event.url);
      }
      {
        this.ngOnInit();
        this.http.get("http://localhost:8080/api/private/v1/groups/" + this.groupId,
          { headers: authService.getAuthHeaders() }).subscribe(c => {
          console.log(c);
        });
      }
    });
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId')); // 'groupId' kommt aus groups/:groupId/details

    console.log('Kurs-ID:', this.courseId);
    console.log('Gruppen-ID:', this.groupId);

    this.loadCourseDetails();
    this.loadGroupDetails();
    this.loadStudents();
    this.loadEvaluations();
    this.checkUserRole();
    this.setUserRole();
    this.loadOverallEvaluation(this.groupId);

    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
  }

  loadGroupDetails(): void {
    this.group$ = this.http.get<any>(`http://localhost:8080/api/private/v1/groups/${this.groupId}`,
      {headers: this.authService.getAuthHeaders()});
    this.group$.subscribe(
      (data) => {
        console.log('Group data:', data);
      },
      (error) => {
        console.error('Error loading group details:', error);
      }
    );
  }

  loadStudents(): void {
    this.students$ = this.http.get<any[]>(`http://localhost:8080/api/private/v1/groups/${this.groupId}/students`,
      {headers: this.authService.getAuthHeaders()});
    this.students$.subscribe(
      (data) => {
        console.log('Students data:', data);
      },
      (error) => {
        console.error('Error loading students:', error);
      }
    );
  }

  loadCourseDetails(): void {
    this.http.get<any>(`http://localhost:8080/api/private/v1/course/${this.courseId}`,
      {headers: this.authService.getAuthHeaders()})
      .subscribe((course) => {
        this.courseName = course.name; // Kursname speichern
      });
  }

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentToGroupDialog, {
      width: '400px',
      data: { groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadStudents(); // Studentenliste neu laden
      }
    });
  }

  openDeleteGroupDialog(groupName: string): void {
    const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
      width: '400px',
      data: { groupName }, // Übergibt den Gruppennamen an den Dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Benutzer klickt "OK"
        this.deleteGroup();
      } else {
        // Benutzer klickt "Abbrechen"
        console.log('Löschvorgang abgebrochen');
      }
    });
  }

  // Methode zum Löschen der Gruppe
  deleteGroup(): void {
    this.http.delete(`http://localhost:8080/api/private/v1/groups/${this.groupId}`,
      {headers: this.authService.getAuthHeaders()}).subscribe({
      next: () => {
        console.log('Gruppe erfolgreich gelöscht');
        this.router.navigate(['/courses', this.courseId, 'details']); // Zurück zur Kurs-Detail-Seite
      },
      error: (err) => alert('Fehler beim Löschen der Gruppe: ' + err.message),
    });
  }

  loadEvaluations(): void {
    this.http
      .get<GroupEvaluation[]>(`http://localhost:8080/api/private/v1/groups/evaluations/${this.groupId}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .subscribe(
        (data) => {
          this.evaluations = data;
          console.log('Evaluations loaded:', this.evaluations);
        },
        (error) => {
          console.error('Error loading evaluations:', error);
        }
      );
  }
  saveEvaluations(): void {
    this.http
      .put<void>(
        `http://localhost:8080/api/private/v1/groups/${this.groupId}/evaluations`,
        this.evaluations,
        { headers: this.authService.getAuthHeaders() }
      )
      .subscribe(
        () => {
          alert('Evaluations saved successfully!');
          this.loadOverallEvaluation(this.groupId); // Gesamtbewertung aktualisieren
        },
        (error) => {
          console.error('Error saving evaluations:', error);
          alert('Failed to save evaluations.');
        }
      );
  }
  protected readonly group = group;

  checkUserRole(): void {
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log('User role:', this.isLecturer ? 'Lecturer' : 'Student');
  }

  private setUserRole() {
    console.log(this.authService.getUserRole());
    if (this.authService.getUserRole() !== 'LECTURER') {
      this.isLecturer = false;
      console.log("Student");
    } else {
      this.isLecturer = true;
      console.log("Lecturer");
    }
  }

  loadOverallEvaluation(groupId: number): void {
    if (!this.isLecturer) {
      console.log('Zugriff verweigert: Nur Dozenten können die Gesamtbewertung laden.');
      return;
    }

    this.http.get<{ totalScore: number; grade: string, gradeColor: string }>(
      `http://localhost:8080/api/private/v1/groups/${groupId}/overall-evaluation`,
      { headers: this.authService.getAuthHeaders() }
    ).subscribe(
      data => {
        this.overallEvaluation = data; // Gesamtbewertung setzen
        console.log('Overall evaluation loaded:', this.overallEvaluation);
      },
      error => {
        console.error('Error loading overall evaluation:', error);
        if (error.status === 400 && error.error?.error) {
          alert(`Fehler: ${error.error.error}`);
        } else {
          alert('Es ist ein unerwarteter Fehler aufgetreten.');
        }
      }
    );
  }

}
