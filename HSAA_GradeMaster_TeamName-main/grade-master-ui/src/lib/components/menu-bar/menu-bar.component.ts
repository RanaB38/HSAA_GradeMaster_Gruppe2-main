import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  // Input() is used to pass data from the parent component to the child component.
  // In this case the data is passed from the app.component.html to the menu-bar.component.html.
  @Input() title: string = '';
  @Input() menuBarItems: MenuBarItem[] = [];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {}

  routerHome() {
    this.router.navigateByUrl('');
  }

  routeTo(routeLink: string) {
    this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
  }
}
