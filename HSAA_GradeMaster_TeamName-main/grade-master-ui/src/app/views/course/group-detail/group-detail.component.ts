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

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '400px',
      data: { groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadStudents(); // Studentenliste neu laden
      }
    });
  }

  deleteGroup(): void {
    if (confirm('Möchten Sie die Gruppe wirklich löschen?')) {
      this.http.delete(`http://localhost:8080/api/v1/groups/${this.groupId}`).subscribe({
        next: () => this.router.navigate(['/courses/details']),
        error: err => alert('Fehler beim Löschen der Gruppe: ' + err.message)
      });
    }
  }

  protected readonly group = group;
}
