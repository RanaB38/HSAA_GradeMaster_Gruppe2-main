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

  // Speichert die Details des Studenten
  public student: Student | undefined;

  /**
   * Erstellt eine Instanz der StudentDetailComponent.
   * @param {ActivatedRoute} route - Ermöglicht den Zugriff auf Routing-Parameter.
   * @param {StudentCoreService} coreService - Service zur Verwaltung von Studentendaten.
   */
  constructor(
    private route: ActivatedRoute,
    private coreService: StudentCoreService) {}

  /**
   * Lifecycle Hook: Wird beim Initialisieren der Komponente aufgerufen.
   * Holt die Studentendaten basierend auf der ID aus der URL.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Filterung der Studentenliste nach ID innerhalb der Detail-Komponente.
      // Alternativ könnte die Filterung auch über den Core- oder Provider-Service erfolgen,
      // um die Daten direkt von der REST-API gefiltert zu beziehen.
      this.coreService.getStudents().subscribe((students) => {
        this.student = students.find((student) => student.id === +id);
      });
    }
  }
}
