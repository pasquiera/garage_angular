import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ICar } from "../models/car";

@Injectable({
        providedIn: 'root'
    })
export class CarListService {

    private readonly CAR_API_URL = 'api/cars.json'; //angular.json "asset":"src/api"

    constructor(private http: HttpClient){
        
    }
    
    public getCars(): Observable<ICar[]> {
      // Besoin de passer l'url en parametre de http.get<ICar[]>(this.CAR_API_URL)
        return this.http.get<ICar[]>(this.CAR_API_URL).pipe( 
            tap(cars => console.log('cars: ', cars)),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }
}