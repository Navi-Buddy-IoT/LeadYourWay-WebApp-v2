import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../env/environment';
import { Rent } from '../models/rent.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RentService {
  cookieService = inject(CookieService);
  private base_Url = environment.baseUrl + 'rents';
  constructor(private http: HttpClient) {}

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

  createItem(rent: Rent): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .post(`${this.base_Url}`, rent, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getItem(id: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(`${this.base_Url}/${id}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getRentedBicycles(userId: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(`${this.base_Url}/user/${userId}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.cookieService.get('JSESSIONID');
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return { headers };
  }
}
