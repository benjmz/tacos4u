import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(private http: HttpClient) { }

  async geocodeBrewery(brewery: any) {
    const breweryAddress = brewery.address_1.replace(' ', '+');
    const breweryCity = brewery.city.replace(' ', '+');
    const breweryState = brewery.state.replace(' ', '+');

    const address = (breweryAddress) ? `?street=${breweryAddress}` : '';
    const city = (breweryCity) ? `&city=${breweryCity}` : '';
    const state = (breweryState) ? `&state=${breweryState}` : '';

    const baseURL = 'https://geocoding.geo.census.gov/geocoder/locations/address';
    const params = address + city + state;
    const endParams = '&format=json&benchmark=4';

    try {
      const response = this.http.get<any>(`${baseURL + params + endParams}`);
      const promise = await lastValueFrom(response).then((res) => {
        const lat = res.result.addressMatches[0].coordinates.x;
        const long = res.result.addressMatches[0].coordinates.y;

        brewery.latitude = lat;
        brewery.longitude = long;
        return brewery;
      });
    } catch (err) {
      console.log(err);
      return;
    }
  }
}
