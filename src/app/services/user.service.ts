import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import ajouté

// Définition de l'interface Stagiaire
export interface Stagiaire {
  id: number;
  email: string;
  role_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Injection de HttpClient
  constructor(private http: HttpClient) {}

  getStagiaires() {
    return this.http.get<Stagiaire[]>(
      'http://localhost:5000/users?role=stagiaire'
    );
  }
}
