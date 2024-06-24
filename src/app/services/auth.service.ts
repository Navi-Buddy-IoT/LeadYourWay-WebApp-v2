import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  cookieService = inject(CookieService);

  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return from(promise);
  }

  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return from(promise);
  }

  logout() {
    this.cookieService.delete('JSESSIONID', '/');
    this.cookieService.delete('JUID', '/');
    return signOut(this.firebaseAuth);
  }

  forgotPassword(email: string): Observable<any> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email);
    return from(promise);
  }
}
