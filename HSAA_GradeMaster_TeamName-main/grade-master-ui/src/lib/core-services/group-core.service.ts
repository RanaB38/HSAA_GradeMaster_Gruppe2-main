import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../provider-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  /** Basis-URL für API-Anfragen zu Gruppen. */
  private apiUrl = '/api/private/v1/groups';

  /**
   * Konstruktor für den GroupService.
   * @param http - HTTP-Client für API-Anfragen.
   * @param authService - Authentifizierungsservice für das Abrufen von Headern.
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Ruft die Gruppen eines bestimmten Kurses ab.
   * @param courseId - Die ID des Kurses.
   * @returns {Observable<any[]>} Ein Observable mit einer Liste von Gruppen.
   */
  getGroupsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Erstellt eine neue Gruppe in einem bestimmten Kurs.
   * @param courseId - Die ID des Kurses, in dem die Gruppe erstellt wird.
   * @param groupName - Der Name der neuen Gruppe.
   * @returns {Observable<any>} Ein Observable mit den Daten der neu erstellten Gruppe.
   */
  addGroup(courseId: number, groupName: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/course/${courseId}`,
      { name: groupName },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
