import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Startet die Angular-Anwendung mit der Hauptkomponente `AppComponent`
 * und der Konfiguration aus `appConfig`.
 * Falls ein Fehler auftritt, wird dieser in der Konsole ausgegeben.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
