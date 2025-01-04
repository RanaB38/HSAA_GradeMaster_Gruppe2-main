import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../provider-services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = '/api/private/v1/groups';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Gruppen eines Kurses abrufen
  getGroupsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/course/${courseId}`,{
      headers: this.authService.getAuthHeaders()
    });
  }

  // Neue Gruppe hinzufügen
  addGroup(courseId: number, groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/course/${courseId}`,
      { name: groupName },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
