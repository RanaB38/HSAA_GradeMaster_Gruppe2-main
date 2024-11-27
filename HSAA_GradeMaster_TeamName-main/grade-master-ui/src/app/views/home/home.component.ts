import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importieren von Router

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeComponent {
  constructor(private router: Router) {} // Router-Injektion

  // Methode zur programmgesteuerten Navigation
  navigateToCourses() {
    this.router.navigate(['/courses/overview']);
  }

  navigateToStudents() {
    this.router.navigate(['/students/list']);
  }
}
