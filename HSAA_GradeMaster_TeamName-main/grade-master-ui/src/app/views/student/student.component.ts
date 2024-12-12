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
  private baseUrl = "http://localhost:8080/api/v1/student";
  public title = 'Studenten';
  public color: MaterialColor = 'accent';
}
