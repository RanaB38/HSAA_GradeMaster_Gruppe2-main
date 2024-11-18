import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { Card } from '../../../../lib/components/card/card.interfaces';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.scss'
})
export class CourseOverviewComponent {


  public cards: Card[] = [ // aus lib
    {
      id: 1,
      title: 'Kurs 1',
      subtitle: 'Erste Kachel',
      content: 'Dies ist der Inhalt der ersten Kachel.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      title: 'Kurs 2',
      subtitle: 'Zweite Kachel',
      content: 'Dies ist der Inhalt der zweiten Kachel.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      title: 'Kurs 3',
      subtitle: 'Dritte Kachel',
      content: 'Dies ist der Inhalt der dritten Kachel.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 4,
      title: 'Kurs 4',
      subtitle: 'Vierte Kachel',
      content: 'Dies ist der Inhalt der vierten Kachel.',
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];

  constructor(private router: Router) {}

    public addCard(): void {
      this.cards.push({ // push um hier das hinzufügen und den Aufruf einer "Add"-Methode zu simulieren
        id: 0, // --> muss durch die API generiert werden
        title: 'Neue Karte',
        subtitle: 'Zusätzliche Karte',
        content: 'Inhalt der neuen Karte.',
        imageUrl: 'https://via.placeholder.com/150'
      });
    }


    public addCourse() {
      // Öffnen einer unabhängigen route, die auf jeder Seite angezeigt werden könnte.
      this.router.navigate([{ outlets: { dialog: ['dialog'] } }]);
    }


}

