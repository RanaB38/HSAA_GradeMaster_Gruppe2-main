import { Injectable } from '@angular/core';
import { NotenspiegelProviderService } from '../provider-services/notenspiegel-provider.service';
import { Notenspiegel } from '../domain/notenspiegel.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotenspiegelCoreService {

  /** BehaviorSubject zur Speicherung der Notenspiegel-Daten */
  private notenspiegelSubject: BehaviorSubject<Notenspiegel[]> = new BehaviorSubject<Notenspiegel[]>([]);

  /** Observable für Notenspiegel-Daten */
  public notenspiegel$: Observable<Notenspiegel[]> = this.notenspiegelSubject.asObservable();

  /**
   * Konstruktor injiziert den NotenspiegelProviderService und lädt initial die Notenspiegel-Daten.
   * @param {NotenspiegelProviderService} notenspiegelService - Service zur Bereitstellung der Notenspiegel-Daten.
   */
  constructor(private notenspiegelService: NotenspiegelProviderService) {
    this.loadNotenspiegel();
  }

  /**
   * Lädt die Notenspiegel-Daten aus dem ProviderService und aktualisiert das BehaviorSubject.
   */
  private loadNotenspiegel(): void {
    this.notenspiegelService.getAllNotenspiegel().subscribe({
      next: (notenspiegel) => {
        console.log('Geladene Notenspiegel:', notenspiegel);
        this.notenspiegelSubject.next(notenspiegel);
      },
      error: (err) => {
        console.error('Fehler beim Laden des Notenspiegels:', err);
      }
    });
  }

  /**
   * Gibt ein Observable der aktuellen Notenspiegel-Daten zurück.
   * @returns {Observable<Notenspiegel[]>} Ein Observable mit der Notenspiegel-Liste.
   */
  getNotenspiegel(): Observable<Notenspiegel[]> {
    return this.notenspiegel$;
  }

  /**
   * Fügt einen neuen Notenspiegel hinzu.
   * Diese Methode aktualisiert nur das lokale Subject, keine Backend-Synchronisierung.
   * @param {Notenspiegel} newNotenspiegel - Der hinzuzufügende Notenspiegel-Eintrag.
   */
  addNotenspiegel(newNotenspiegel: Notenspiegel): void {
    const currentNotenspiegel = this.notenspiegelSubject.value;
    const updatedNotenspiegel = [...currentNotenspiegel, newNotenspiegel];
    this.notenspiegelSubject.next(updatedNotenspiegel);
  }
}
