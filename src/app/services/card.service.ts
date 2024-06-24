import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../env/environment';
import { CookieService } from 'ngx-cookie-service';
import { CardSave } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  cookieService = inject(CookieService);
  private base_Url = environment.baseUrl + 'cards';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };

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
      // Default Error Handling
      console.log(
        `An error occurred ${error.status}, body was: ${error.error}`
      );
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    // Return Observable with Error Message to Client
    return throwError(
      'Something happened with request, please try again later.'
    );
  }

  getItem(id: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(`${this.base_Url}/${id}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  createItem(id: string | null, card: CardSave): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .post(`${this.base_Url}/${id}`, card, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
}
