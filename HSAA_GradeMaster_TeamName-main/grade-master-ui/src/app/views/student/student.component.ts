import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MaterialColor } from '../../../lib/enums/material-color';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {

  // Basis-URL für API-Anfragen (derzeit nicht verwendet)
  private baseUrl = "http://localhost:8080/api/private/v1/student";

  // Titel der Komponente
  public title = 'Studenten';

  // Farbe des UI-Elements, standardmäßig 'accent'
  public color: MaterialColor = 'accent';

}
