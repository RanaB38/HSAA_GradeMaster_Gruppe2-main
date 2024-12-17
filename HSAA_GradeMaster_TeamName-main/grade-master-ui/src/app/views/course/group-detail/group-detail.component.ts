import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, RouterLink} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddStudentDialogComponent } from '../add-student-dialog/add-student-dialog.component';
import {AsyncPipe} from "@angular/common";
import {group} from "@angular/animations";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {GroupDeleteDialogComponent} from "./group-delete-dialog.component";
import {AddStudentToGroupDialog} from "./add-student-to-group-dialog.component";


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule,
    MatButtonModule
  ],
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  groupId!: number;
  courseId!: number;
  courseName!: string;
  group$!: Observable<any>;
  students$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigating to:', event.url);
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
  }

  loadGroupDetails(): void {
    this.group$ = this.http.get<any>(`http://localhost:8080/api/v1/groups/${this.groupId}`);
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
    this.students$ = this.http.get<any[]>(`http://localhost:8080/api/v1/groups/${this.groupId}/students`);
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
    this.http.get<any>(`http://localhost:8080/api/v1/course/${this.courseId}`)
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
    this.http.delete(`http://localhost:8080/api/v1/groups/${this.groupId}`).subscribe({
      next: () => {
        console.log('Gruppe erfolgreich gelöscht');
        this.router.navigate(['/courses', this.courseId, 'details']); // Zurück zur Kurs-Detail-Seite
      },
      error: (err) => alert('Fehler beim Löschen der Gruppe: ' + err.message),
    });
  }

  protected readonly group = group;
}
