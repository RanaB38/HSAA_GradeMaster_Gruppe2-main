import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddStudentToGroupDialog } from "./add-student-to-group-dialog.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GroupDeleteDialogComponent } from "./group-delete-dialog.component";
import { AuthService } from "../../../../lib/provider-services/auth.service";
import { GroupEvaluation } from "../../../../lib/domain/group-evaluation.inferface";
import { FormsModule } from "@angular/forms";
import { NotenspiegelProviderService } from "../../../../lib/provider-services/notenspiegel-provider.service";

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    FormsModule
  ],
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  groupId!: number; // ID der Gruppe
  courseId!: number; // ID des Kurses
  courseName!: string; // Name des Kurses
  group$!: Observable<any>; // Observable für Gruppendaten
  students$!: Observable<any[]>; // Observable für Studentendaten
  evaluations: GroupEvaluation[] = []; // Liste der Gruppenbewertungen
  overallEvaluation: any = {
    totalScore: 0,
    grade: 'Keine Note'
  };
  isLecturer: boolean = false; // Gibt an, ob der Benutzer ein Dozent ist

  /**
   * Konstruktor für die GroupDetailComponent.
   * @param {ActivatedRoute} route - Die aktuelle Route mit Parametern.
   * @param {HttpClient} http - Service für HTTP-Anfragen.
   * @param {MatDialog} dialog - Service für das Öffnen von Dialogen.
   * @param {Router} router - Service für die Navigation.
   * @param {AuthService} authService - Service zur Benutzer-Authentifizierung.
   * @param {NotenspiegelProviderService} notenSpiegel - Service zur Verwaltung des Notenspiegels.
   */
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
        this.http.get(`http://localhost:8080/api/private/v1/groups/${this.groupId}`,
          { headers: authService.getAuthHeaders() }).subscribe(c => {
          console.log(c);
        });
      }
    });
  }

  /**
   * Initialisiert die Komponente, lädt Kurs- und Gruppendetails und überprüft die Benutzerrolle.
   */
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));

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

  /**
   * Lädt die Gruppendetails von der API.
   */
  loadGroupDetails(): void {
    this.group$ = this.http.get<any>(`http://localhost:8080/api/private/v1/groups/${this.groupId}`,
      { headers: this.authService.getAuthHeaders() });
    this.group$.subscribe(
      data => console.log('Group data:', data),
      error => console.error('Error loading group details:', error)
    );
  }

  /**
   * Lädt die Studenten der Gruppe von der API.
   */
  loadStudents(): void {
    this.students$ = this.http.get<any[]>(`http://localhost:8080/api/private/v1/groups/${this.groupId}/students`,
      { headers: this.authService.getAuthHeaders() });
    this.students$.subscribe(
      data => console.log('Students data:', data),
      error => console.error('Error loading students:', error)
    );
  }

  /**
   * Lädt die Kursdetails von der API.
   */
  loadCourseDetails(): void {
    this.http.get<any>(`http://localhost:8080/api/private/v1/course/${this.courseId}`,
      { headers: this.authService.getAuthHeaders() })
      .subscribe(course => this.courseName = course.name);
  }

  /**
   * Öffnet den Dialog zum Hinzufügen eines Studenten zur Gruppe.
   */
  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentToGroupDialog, {
      width: '400px',
      data: { groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) this.loadStudents();
    });
  }

  /**
   * Öffnet den Dialog zum Löschen einer Gruppe.
   * @param {string} groupName - Name der Gruppe.
   */
  openDeleteGroupDialog(groupName: string): void {
    const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
      width: '400px',
      data: { groupName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.deleteGroup();
      else console.log('Löschvorgang abgebrochen');
    });
  }

  /**
   * Löscht die Gruppe.
   */
  deleteGroup(): void {
    this.http.delete(`http://localhost:8080/api/private/v1/groups/${this.groupId}`,
      { headers: this.authService.getAuthHeaders() })
      .subscribe({
        next: () => {
          console.log('Gruppe erfolgreich gelöscht');
          this.router.navigate(['/courses', this.courseId, 'details']);
        },
        error: err => alert('Fehler beim Löschen der Gruppe: ' + err.message),
      });
  }

  /**
   * Lädt die Gruppenbewertungen von der API.
   */
  loadEvaluations(): void {
    this.http.get<GroupEvaluation[]>(`http://localhost:8080/api/private/v1/groups/evaluations/${this.groupId}`,
      { headers: this.authService.getAuthHeaders() })
      .subscribe(
        data => {
          this.evaluations = data;
          console.log('Evaluations loaded:', this.evaluations);
        },
        error => console.error('Error loading evaluations:', error)
      );
  }

  /**
   * Speichert die Gruppenbewertungen.
   */
  saveEvaluations(): void {
    this.http.put<void>(`http://localhost:8080/api/private/v1/groups/${this.groupId}/evaluations`,
      this.evaluations, { headers: this.authService.getAuthHeaders() })
      .subscribe(
        () => {
          this.loadOverallEvaluation(this.groupId);
        },
        error => {
          console.error('Error saving evaluations:', error);
          alert('Failed to save evaluations.');
        }
      );
  }

  /**
   * Überprüft die Rolle des Benutzers (Dozent oder Student).
   */
  checkUserRole(): void {
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log('User role:', this.isLecturer ? 'Lecturer' : 'Student');
  }

  /**
   * Setzt die Benutzerrolle basierend auf der Authentifizierung.
   */
  private setUserRole(): void {
    console.log(this.authService.getUserRole());
    this.isLecturer = this.authService.getUserRole() === 'LECTURER';
    console.log(this.isLecturer ? "Lecturer" : "Student");
  }

  /**
   * Lädt die Gesamtbewertung der Gruppe, falls der Benutzer ein Dozent ist.
   * @param {number} groupId - ID der Gruppe.
   */
  loadOverallEvaluation(groupId: number): void {
    if (!this.isLecturer) {
      console.log('Zugriff verweigert: Nur Dozenten können die Gesamtbewertung laden.');
      return;
    }

    this.http.get<{ totalScore: number; grade: string, gradeColor: string }>
    (`http://localhost:8080/api/private/v1/groups/${groupId}/overall-evaluation`,
      { headers: this.authService.getAuthHeaders() })
      .subscribe(
        data => this.overallEvaluation = data,
        error => console.error('Error loading overall evaluation:', error)
      );
  }
}
