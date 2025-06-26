import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //connecte = localStorage.getItem('jwt') != null ;

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
}
