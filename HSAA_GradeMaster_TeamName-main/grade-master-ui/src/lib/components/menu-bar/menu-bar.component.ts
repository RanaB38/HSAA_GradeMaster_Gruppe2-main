import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MenuBarItem } from './menu-bar.interfaces';

/**
 * Die `MenuBarComponent` stellt eine Navigationsleiste bereit,
 * die verschiedene Menüeinträge enthält und Benutzerdaten anzeigen kann.
 */
@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LayoutModule,
  ],
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent {

  /** Der Titel der Menüleiste */
  @Input() title: string = '';

  /** Liste der Menüeinträge */
  @Input() menuBarItems: MenuBarItem[] = [];

  /** Der Benutzername des aktuell eingeloggten Nutzers */
  @Input() username: string = '';

  /** Die Rolle des aktuell eingeloggten Nutzers */
  @Input() role: string = '';

  /**
   * Konstruktor für `MenuBarComponent`.
   * @param router - Router für die Navigation
   * @param activatedRoute - Aktivierte Route für relative Navigation
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  /**
   * Navigiert zur Startseite der Anwendung.
   */
  routerHome() {
    this.router.navigateByUrl('');
  }

  /**
   * Navigiert zu einer angegebenen Route.
   *
   * @param routeLink - Der Pfad der Zielroute
   */
  routeTo(routeLink: string) {
    this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
  }
}
