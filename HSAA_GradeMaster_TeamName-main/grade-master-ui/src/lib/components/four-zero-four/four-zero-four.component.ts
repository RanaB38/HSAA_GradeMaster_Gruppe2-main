import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

// This component is used to display a 404 error page.
// It is used in the app-routing.module.ts.
// It is a standalone component.
@Component({
  selector: 'app-four-zero-four',
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
  templateUrl: './four-zero-four.component.html',
  styleUrl: './four-zero-four.component.scss',
})
export class FourZeroFourComponent {}
