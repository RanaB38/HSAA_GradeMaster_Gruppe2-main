import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { Notenspiegel } from '../domain/notenspiegel.interfaces';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotenspiegelProviderService {
  private notenspiegelSubject: BehaviorSubject<Notenspiegel[]> = new BehaviorSubject<Notenspiegel[]>([]);
  public notenspiegel$: Observable<Notenspiegel[]> = this.notenspiegelSubject.asObservable();
  private baseUrl = 'http://localhost:8080/api/public/v1/notenspiegel';
  private initializeUrl = 'http://localhost:8080/api/public/v1/notenspiegel/initialize';

  constructor(private httpClient: HttpClient) {
    this.loadNotenspiegel();
  }

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

  private initializeNotenspiegel(): void {
    this.httpClient.post(this.initializeUrl, {}).subscribe({
      next: () => {
        console.log('Notenspiegel erfolgreich initialisiert.');
        this.loadNotenspiegel();  // Nachdem initialisiert wurde, versuche erneut, die Notenspiegel-Daten zu laden
      },
      error: (err) => {
        console.error('Fehler bei der Initialisierung des Notenspiegels:', err);
      }
    });
  }

  public getAllNotenspiegel(): Observable<Notenspiegel[]> {
    return this.notenspiegel$;
  }
}
