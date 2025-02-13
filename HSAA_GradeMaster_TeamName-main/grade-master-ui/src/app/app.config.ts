import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

/**
 * Konfigurationsobjekt für die Angular-Anwendung.
 * Hier werden zentrale Provider wie Routing, HTTP-Client und Animationen definiert.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Aktiviert `ZoneChangeDetection` mit `eventCoalescing`, um unnötige
     * Change Detection-Zyklen zu reduzieren und die Performance zu verbessern.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Stellt die Routen für die Anwendung bereit.
     */
    provideRouter(routes),

    /**
     * Stellt den HTTP-Client für API-Anfragen bereit.
     */
    provideHttpClient(),

    /**
     * Aktiviert Browser-Animationen für Angular Material und andere Animationen.
     */
    provideAnimations(),
  ]
};
