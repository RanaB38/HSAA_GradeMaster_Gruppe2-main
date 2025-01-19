import { Injectable } from '@angular/core';
import { NotenspiegelProviderService } from '../provider-services/notenspiegel-provider.service';
import { Notenspiegel } from '../domain/notenspiegel.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotenspiegelCoreService {

  private notenspiegelSubject: BehaviorSubject<Notenspiegel[]> = new BehaviorSubject<Notenspiegel[]>([]);
  public notenspiegel$: Observable<Notenspiegel[]> = this.notenspiegelSubject.asObservable();

  constructor(private notenspiegelService: NotenspiegelProviderService) {
    // Initialisiere das Laden der Notenspiegel-Daten
    this.loadNotenspiegel();
  }

  private loadNotenspiegel(): void {
    this.notenspiegelService.getAllNotenspiegel().subscribe({
      next: (notenspiegel) => {
        console.log('Geladene Notenspiegel:', notenspiegel);
        this.notenspiegelSubject.next(notenspiegel);
      },
      error: (err) => {
        console.error('Fehler beim Laden des Notenspiegel:', err);
      }
    });
  }

  // Methode zum Abrufen der Notenspiegel-Daten
  getNotenspiegel(): Observable<Notenspiegel[]> {
    return this.notenspiegel$;
  }

  // Beispiel: Eine Methode zum Hinzufügen eines Notenspiegels (falls gewünscht)
  addNotenspiegel(newNotenspiegel: Notenspiegel): void {
    const currentNotenspiegel = this.notenspiegelSubject.value;
    const updatedNotenspiegel = [...currentNotenspiegel, newNotenspiegel];
    this.notenspiegelSubject.next(updatedNotenspiegel);
  }
}
