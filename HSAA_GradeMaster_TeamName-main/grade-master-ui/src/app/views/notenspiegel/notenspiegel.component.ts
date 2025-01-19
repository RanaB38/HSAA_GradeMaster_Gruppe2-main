import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MaterialColor} from "../../../lib/enums/material-color";
import { Notenspiegel } from '../../../lib/domain/notenspiegel.interfaces';
import { NotenspiegelProviderService } from '../../../lib/provider-services/notenspiegel-provider.service';
import {Observable} from "rxjs";
import { NotenspiegelCoreService } from '../../../lib/core-services/notenspiegel-core.service';

@Component({
  selector: 'app-notenspiegel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
  ],
  templateUrl: './notenspiegel.component.html',
  styleUrls: ['./notenspiegel.component.scss'],
})
export class NotenspiegelComponent implements OnInit{
  //private baseUrl = "http://localhost:8080/api/public/v1/notenspiegel";
  public title = 'Notenspiegel';
  public color: MaterialColor = 'accent';

  notenspiegel: Notenspiegel[] = [];

  constructor(private notenspiegelCoreService: NotenspiegelCoreService) {}

  ngOnInit(): void {
    this.notenspiegelCoreService.getNotenspiegel().subscribe({
      next: (data) => {
        console.log('Geladene Notenspiegel:', data); // Debugging
        this.notenspiegel = data;
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Notenspiegel:', err);
      }
    });
  }

  // Methode zur Bestimmung der Farbe basierend auf der Note
  getColorForGrade(grade: string): string {
    switch (grade) {
      case '1.0':
      case '1.3':
        return 'green';  // Sehr gut
      case '1.7':
      case '2.0':
      case '2.3':
        return 'yellowgreen';  // Gut
      case '2.7':
      case '3.0':
      case '3.3':
        return 'yellow';  // Befriedigend
      case '3.7':
      case '4.0':
        return 'orange';  // Ausreichend
      case '5.0':
        return 'red';  // Nicht bestanden
      default:
        return 'white';
    }
  }

}
