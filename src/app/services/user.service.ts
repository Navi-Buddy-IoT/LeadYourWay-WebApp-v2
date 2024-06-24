import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { SaveUser, User } from '../models/user.model';
import { environment } from '../env/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  cookieService = inject(CookieService);
  base_Url = environment.baseUrl + 'users';

  httpOptions = this.getHttpOptions();

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.cookieService.get('JSESSIONID');
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return { headers };
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error ocurred ${error.status},body was: ${error.error}`);
    } else {
      console.log(
        `Backend returned cod ${error.status}, body was: ${error.error}`
      );
    }
    return throwError('Something happend with request, try again');
  }

  getItem(id: string | null): Observable<User> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get<User>(`${this.base_Url}/${id}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateItem(item: SaveUser): Observable<User> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .patch<User>(`${this.base_Url}`, item, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  registerUser(user: SaveUser, token: string): Observable<SaveUser> {
    return this.http
      .post<SaveUser>(`${this.base_Url}/register/biker`, user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(retry(2), catchError(this.handleError));
  }
}
