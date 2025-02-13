import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MatFormField } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { AuthService } from "../../../../lib/provider-services/auth.service";
import {Observable} from "rxjs";

/**
 * Component zum Bearbeiten des Bewertungsschemas eines Kurses.
 * Ermöglicht das Laden, Bearbeiten und Speichern eines Bewertungsschemas.
 *
 * @component
 */
@Component({
  selector: 'app-bewertungsschema-edit',
  templateUrl: './bewertungsschema-edit.component.html',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    RouterLink
  ],
  styleUrls: ['./bewertungsschema-edit.component.scss']
})
export class BewertungsschemaEditComponent {

  /** Das Bewertungsschema des Kurses. */
  public bewertungsschema: { topic: string; percentage: number; id: number }[] = [];

  /** Fehlermeldung, falls beim Laden oder Speichern ein Fehler auftritt. */
  public errorMessage: string | null = null;

  /** Die Kurs-ID, die zur Identifikation des Kurses dient. */
  public courseId!: number;

  /**
   * Erzeugt eine Instanz des BewertungsschemaEditComponents.
   *
   * @param http - Der HTTP-Client, um API-Anfragen zu senden.
   * @param route - Der Router, um auf Routenparameter zuzugreifen.
   * @param router - Der Router, um zur Kurs-Detailseite zu navigieren.
   * @param authService - Der Authentifizierungsdienst, um die Auth-Header zu erhalten.
   */
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Initialisiert das Komponent und lädt das Bewertungsschema des Kurses.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    this.loadSchema();
  }
  group$!: Observable<any>; // Observable für Gruppendaten
  courseName!: string; // Name des Kurses
  /**
   * Lädt das Bewertungsschema für den angegebenen Kurs.
   *
   * @returns {void}
   */
  loadSchema(): void {
    this.http
      .get<{ topic: string; percentage: number; id: number }[]>(
        `http://localhost:8080/api/private/v1/bewertungsschema/course/${this.courseId}`,
        { headers: this.authService.getAuthHeaders() } // Authentifizierungs-Header
      )
      .subscribe({
        next: (data) => {
          this.bewertungsschema = data; // Daten inklusive IDs speichern
          console.log('Bewertungsschema geladen:', this.bewertungsschema);
        },
        error: (err) => {
          console.error('Fehler beim Laden des Schemas:', err);
          this.errorMessage = 'Fehler beim Laden des Schemas. Bitte versuchen Sie es später erneut.';
        },
      });
  }

  /**
   * Speichert das Bewertungsschema.
   * Überprüft, ob alle Felder korrekt ausgefüllt sind, bevor es gespeichert wird.
   *
   * @returns {void}
   */
  save(): void {
    // Überprüfen, ob alle Topics gefüllt sind
    if (this.bewertungsschema.some(item => !item.topic || item.topic.trim() === '')) {
      this.errorMessage = 'Alle Topics müssen ausgefüllt sein.';
      return;
    }

    // Überprüfen, ob alle Topics eindeutig sind
    const uniqueTopics = new Set(this.bewertungsschema.map(item => item.topic));
    if (uniqueTopics.size !== this.bewertungsschema.length) {
      this.errorMessage = 'Alle Topics müssen eindeutig sein.';
      return;
    }

    // Überprüfen, ob die Summe der Prozentwerte 100 ergibt
    const totalPercentage = this.bewertungsschema.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPercentage !== 100) {
      this.errorMessage = 'Die Summe der Gewichtung muss genau 100% betragen.';
      return;
    }

    // Sicherstellen, dass keine IDs beim neuen Schema gesetzt sind
    const dataToSave = this.bewertungsschema.map(schema => {
      const { id, ...rest } = schema; // Entferne die ID, falls sie existiert
      return rest;
    });

    this.http
      .post(
        `http://localhost:8080/api/private/v1/bewertungsschema/course/${this.courseId}`,
        this.bewertungsschema,
        { headers: this.authService.getAuthHeaders() }
      )
      .subscribe({
        next: () => {
          // Erfolgreiches Speichern: Zurück zur Kurs-Detailseite
          this.errorMessage = null; // Fehler zurücksetzen
          this.router.navigate([`/courses/${this.courseId}/details`]);
        },
        error: (err) => {
          console.error('Fehler beim Speichern:', err);
          if (err.status === 401) {
            this.errorMessage = 'Sie sind nicht autorisiert, Änderungen zu speichern.';
          } else {
            this.errorMessage = 'Ein Fehler ist beim Speichern aufgetreten.';
          }
        },
      });
  }

  /**
   * Fügt eine neue Zeile zum Bewertungsschema hinzu.
   *
   * @returns {void}
   */
  addRow(): void {
    const newIndex = this.bewertungsschema.length + 1;
    const newId = new Date().getTime();
    this.bewertungsschema.push({ topic: `Topic #${newIndex}`, percentage: 0 , id: newId });
  }

  /**
   * Löscht ein Bewertungsschema mit der angegebenen ID.
   *
   * @param bewertungsschemaId - Die ID des zu löschenden Bewertungsschemas.
   * @returns {void}
   */
  deleteBewertungsschema(bewertungsschemaId: number): void {
    if (this.bewertungsschema.length === 1) {
      this.errorMessage = 'Es muss mindestens ein Topic vorhanden bleiben.';
      return;
    }

    if (!bewertungsschemaId || bewertungsschemaId <= 0) {
      this.bewertungsschema = this.bewertungsschema.filter(item => item.id !== bewertungsschemaId);
      console.log('Eintrag lokal gelöscht, keine gültige ID.');
      return;
    }

    this.http.get(`http://localhost:8080/api/private/v1/bewertungsschema/${bewertungsschemaId}`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe(
      () => {
        this.http.delete(`http://localhost:8080/api/private/v1/bewertungsschema/${bewertungsschemaId}`, {
          headers: this.authService.getAuthHeaders()
        }).subscribe(
          () => {
            console.log("Bewertungsschema aus der Datenbank gelöscht!");
            this.bewertungsschema = this.bewertungsschema.filter(item => item.id !== bewertungsschemaId);
          },
          error => {
            console.error('Fehler beim Löschen aus der Datenbank:', error);
            this.errorMessage = 'Fehler beim Löschen des Bewertungsschemas.';
          }
        );
      },
      error => {
        console.error('Fehler: Bewertungsschema existiert nicht im Backend:', error);
        this.bewertungsschema = this.bewertungsschema.filter(item => item.id !== bewertungsschemaId);
      }
    );
  }
}
