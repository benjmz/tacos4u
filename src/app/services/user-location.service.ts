import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLocationService {
  constructor() { }
  private navigator : Navigator = window.navigator;
  userPosition = {latitude: 0, longitude: 0}

  getUserLocation() {
    var lat;
    var long;
    this.navigator.geolocation.getCurrentPosition((position) => {
      this.userPosition.latitude = position.coords.latitude;
      this.userPosition.longitude = position.coords.longitude;

    });
    return this.userPosition;
  };

}
