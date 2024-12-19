import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = '/api/private/v1/groups';

  constructor(private http: HttpClient) {}

  // Gruppen eines Kurses abrufen
  getGroupsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`);
  }

  // Neue Gruppe hinzufügen
  addGroup(courseId: number, groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course/${courseId}`, { name: groupName });
  }
}
