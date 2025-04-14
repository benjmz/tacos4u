import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  async geocodeBrewery(brewery: any): Promise<any> {
    const breweryAddress = encodeURIComponent(brewery.address_1);
    const breweryCity = encodeURIComponent(brewery.city);
    const breweryState = encodeURIComponent(brewery.state);

    const address = breweryAddress ? `street=${breweryAddress}` : '';
    const city = breweryCity ? `&city=${breweryCity}` : '';
    const state = breweryState ? `&state=${breweryState}` : '';

    const baseURL = 'http://localhost:3000/geocode';
    const params = address + city + state;
    const endParams = '&format=json&benchmark=2020';

    try {
      const response = this.http.get<any>(`${baseURL}?${params}${endParams}`);
      const res = await lastValueFrom(response);
      const addresses = res.result?.addressMatches || [];

      if (addresses.length > 0) {
        brewery.latitude = addresses[0].coordinates.y;
        brewery.longitude = addresses[0].coordinates.x;
        return brewery;
      } else {
        console.log(`No addresses found for ${brewery.name}. This will not geocode.`);
        return brewery;
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      return brewery;
    }
  }
}