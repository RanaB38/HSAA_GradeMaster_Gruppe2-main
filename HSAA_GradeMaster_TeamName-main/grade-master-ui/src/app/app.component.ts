import { Component, OnInit } from '@angular/core';
import { AuthService } from '../lib/provider-services/auth.service';
import { MenuBarItem } from '../lib/components/menu-bar/menu-bar.interfaces';
import { of } from 'rxjs';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from '../lib/components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuBarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LayoutModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  // Titel der Anwendung
  title = 'GRADE MASTER';

  // eintäge für die Navigation
  public menuItems: MenuBarItem[] = [
    { name: 'Home', routePath: 'home', visible: of(true), icon: 'home' },
    { name: 'Kurse', routePath: 'courses', visible: of(true) },
    { name: 'Studenten', routePath: 'students', visible: of(true) },
    { name: 'Notenspiegel', routePath: 'notenspiegel', visible: of(true) },
  ];

  // Benutzerinformationen
  username: string = '';
  role: string = '';

  // Standard-Profilbild-URL
  profileImageUrl: string = 'https://www.example.com/path/to/profile-image.jpg';

  /**
   * Erstellt eine Instanz der AppComponent.
   * @param {AuthService} authService - Service zur Authentifizierung und Benutzerverwaltung.
   */
  constructor(private authService: AuthService) {}

  /**
   * Lifecycle Hook: Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt Benutzerdaten aus dem AuthService.
   */
  ngOnInit() {
    // Benutzerdaten aus dem AuthService abrufen
    this.username = this.authService.getUsername();
    this.role = this.authService.getUserRole();

    // Falls das Profilbild dynamisch ist, kann es hier gesetzt werden
    // this.profileImageUrl = this.authService.getUserProfileImageUrl();
  }
}
