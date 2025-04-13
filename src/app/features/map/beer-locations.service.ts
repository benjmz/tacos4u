import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brewery } from '../brewery.dto';

@Injectable({
  providedIn: 'root'
})
export class BeerLocationsService {
  private apiURL : string = 'https://api.openbrewerydb.org/v1/breweries';
  
  constructor(private http: HttpClient) {}
  getBeerData(pageNumber: number) : Observable<any[]> {
    const response = this.http.get<any[]>(`${this.apiURL}?by_city=Austin&page=${pageNumber}`);
    return response;

    /*
    
    */
  }

}
