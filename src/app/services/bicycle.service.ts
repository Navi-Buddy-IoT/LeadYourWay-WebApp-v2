import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { environment } from '../env/environment';
import { Bicycle } from '../models/bicycle.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class BicycleService {
  cookieService = inject(CookieService);

  private base_Url = environment.baseUrl + 'bicycles';

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
      console.log(
        `An error occurred ${error.status}, body was: ${error.error}`
      );
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      'Something happened with the request, please try again later.'
    );
  }

  getList(): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(`${this.base_Url}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getItem(id: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(`${this.base_Url}/${id}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  createItem(id: number, bicycle: Bicycle): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .post(`${this.base_Url}/${id}`, bicycle, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateItem(id: number, bicycle: Bicycle): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .put(`${this.base_Url}/${id}`, bicycle, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteItem(id: number): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .delete(`${this.base_Url}/${id}`, httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getBicyclesByDateRange(startDate: string, endDate: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http
      .get(
        `${this.base_Url}/available?start_date=${startDate}&end_date=${endDate}`,
        httpOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }
}
