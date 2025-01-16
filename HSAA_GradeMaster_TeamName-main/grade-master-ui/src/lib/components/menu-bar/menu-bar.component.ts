import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MenuBarItem } from './menu-bar.interfaces';

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
  @Input() title: string = '';
  @Input() menuBarItems: MenuBarItem[] = [];
  @Input() username: string = '';  // Benutzername wird als Input erwartet
  @Input() role: string = '';  // Rolle wird als Input erwartet

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  routerHome() {
    this.router.navigateByUrl('');
  }

  routeTo(routeLink: string) {
    this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
  }
}
