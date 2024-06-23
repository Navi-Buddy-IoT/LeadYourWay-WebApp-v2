import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
} from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private cookieService: CookieService) {}

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(credentials: any) {
    return signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
  }

  logout() {
    this.cookieService.delete('JSESSIONID', '/');
    this.cookieService.delete('JUID', '/');
    return signOut(this.auth);
  }

  refreshToken() {
    return signInWithCustomToken(
      this.auth,
      this.cookieService.get('JSESSIONID') || ''
    );
  }
}
