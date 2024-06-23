import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  user,
} from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth2Service {
  firebaseAuth = inject(Auth);

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
}
