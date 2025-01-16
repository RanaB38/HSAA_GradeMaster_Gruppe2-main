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
  title = 'GRADE MASTER';
  public menuItems: MenuBarItem[] = [
    { name: 'Home', routePath: 'home', visible: of(true), icon: 'home' },
    { name: 'Kurse', routePath: 'courses', visible: of(true) },
    { name: 'Studenten', routePath: 'students', visible: of(true) },
  ];

  username: string = '';
  role: string = '';
  profileImageUrl: string = 'https://www.example.com/path/to/profile-image.jpg'; // Beispiel URL für das Profilbild

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Benutzerdaten aus dem AuthService abrufen
    this.username = this.authService.getUsername();
    this.role = this.authService.getUserRole();

    // Hier kannst du das Profilbild-URL aus dem AuthService abrufen, wenn es dynamisch ist
    // this.profileImageUrl = this.authService.getUserProfileImageUrl();
  }
}
