import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialColor } from '../../../lib/enums/material-color';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {

    public title = 'Kurse';
    public color: MaterialColor = 'accent';

}
