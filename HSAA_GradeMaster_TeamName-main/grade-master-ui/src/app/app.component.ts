import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { of } from 'rxjs';
import { MenuBarComponent } from '../lib/components/menu-bar/menu-bar.component';
import { MenuBarItem } from '../lib/components/menu-bar/menu-bar.interfaces';

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
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GRADE MASTER';

  public menuItems: MenuBarItem[] = [
    {
      name: 'Impressum',
      routePath: 'impressum',
            visible: of(true),
    },
    {
      name: 'Login',
      routePath: 'login',
            visible: of(true),
      highlighted: true,
      icon: 'login',
    }, 
   ]
}
