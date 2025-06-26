import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  connecte = false;

  constructor() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.connecte = true;
    }
  }

  setJwt(jwt: string) {
    localStorage.setItem('jwt', jwt);
    this.connecte = true;
  }

  removeJwt() {
    localStorage.removeItem('jwt');
    this.connecte = false;
  }

  getUserRole(): string {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return 'guest';

    // Décodage du JWT sans dépendance externe
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.role || 'guest';
    } catch {
      return 'guest';
    }
  }

  getUserId(): number | null {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.userId; // Adapter à votre structure JWT
    } catch {
      return null;
    }
  }
}
