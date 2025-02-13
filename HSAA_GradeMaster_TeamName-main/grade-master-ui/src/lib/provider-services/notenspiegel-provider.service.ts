import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Notenspiegel } from '../domain/notenspiegel.interfaces';
import { HttpClient } from '@angular/common/http';
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotenspiegelProviderService {

  /**
   * BehaviorSubject zur Speicherung und Verwaltung der Notenspiegel-Daten.
   * Wird mit einem leeren Array initialisiert.
   */
  private notenspiegelSubject: BehaviorSubject<Notenspiegel[]> = new BehaviorSubject<Notenspiegel[]>([]);

  /**
   * Observable, um Änderungen an der Notenspiegel-Liste zu verfolgen.
   */
  public notenspiegel$: Observable<Notenspiegel[]> = this.notenspiegelSubject.asObservable();

  /** Basis-URL für den Notenspiegel-API-Endpunkt */
  private baseUrl = 'http://localhost:8080/api/public/v1/notenspiegel';

  /** URL zur Initialisierung des Notenspiegels, falls keine Daten vorhanden sind */
  private initializeUrl = 'http://localhost:8080/api/public/v1/notenspiegel/initialize';

  constructor(private httpClient: HttpClient) {
    this.loadNotenspiegel();
  }

  /**
   * Lädt die Notenspiegel-Daten vom Server und aktualisiert das Subject.
   * Falls die API eine leere Antwort zurückgibt, wird der Notenspiegel initialisiert.
   */
  private loadNotenspiegel(): void {
    this.httpClient.get<Notenspiegel[]>(this.baseUrl).pipe(
      catchError((err) => {
        console.error('Fehler beim Abrufen des Notenspiegels:', err);
        return throwError(() => new Error('API-Abruf fehlgeschlagen'));
      })
    ).subscribe({
      next: (notenspiegel) => {
        if (!notenspiegel || notenspiegel.length === 0) {
          console.warn('Leere Antwort vom Backend.');
          this.initializeNotenspiegel();
        }
        this.notenspiegelSubject.next(notenspiegel || []);
      },
      error: (err) => {
        console.error('Fehler beim Laden des Notenspiegels:', err);
      }
    });
  }

  /**
   * Falls keine Notenspiegel-Daten vorhanden sind, wird dieser initialisiert.
   * Nach erfolgreicher Initialisierung werden die Daten erneut geladen.
   */
  private initializeNotenspiegel(): void {
    this.httpClient.post(this.initializeUrl, {}).subscribe({
      next: () => {
        console.log('Notenspiegel erfolgreich initialisiert.');
        this.loadNotenspiegel();  // Erneutes Laden nach Initialisierung
      },
      error: (err) => {
        console.error('Fehler bei der Initialisierung des Notenspiegels:', err);
      }
    });
  }

  /**
   * Gibt ein Observable mit der aktuellen Notenspiegel-Liste zurück.
   * @returns {Observable<Notenspiegel[]>} Observable mit der Notenspiegel-Datenliste.
   */
  public getAllNotenspiegel(): Observable<Notenspiegel[]> {
    return this.notenspiegel$;
  }
}
