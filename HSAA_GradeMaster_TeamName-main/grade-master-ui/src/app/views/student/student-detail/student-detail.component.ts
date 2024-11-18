import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentCoreService } from '../../../../lib/core-services/student-core.service';
import { Student } from '../../../../lib/domain/student.interfaces';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {

  public student: Student | undefined;
  // public student!: Student;

  constructor(
    private route: ActivatedRoute, // Um Routing-Parameter auszulesen
    private coreService: StudentCoreService) {

      // wie in ngOnInit()
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Eine Möglichkeit die Filterung nach Student-Id direkt in der detail-component vorzunehmen.
      // Eine andere Möglichkeit wäre das Ganze über den Core-Service bis in den Provider-Service zu geben.
      // Hier würde dann die Filterung über die REST-API gehen.
      this.coreService.getStudents().subscribe((students) => {
        this.student = students.find((student) => student.id === +id);
      });
    }
  }

}
