import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import "@arcgis/map-components/components/arcgis-map";
import { BeerLocationsService } from './beer-locations.service';
import { Brewery } from '../brewery.dto';
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapComponent implements OnInit {
  breweries : any[] = [];
  pageNumber : number = 1;

  constructor(private beerService: BeerLocationsService) {}

  ngOnInit() {}

  paginateAPI(pageNumber : number, breweryArray : any[]) {
    this.beerService.getBeerData(pageNumber).subscribe(brewData => {
      if (brewData.length > 0) {
        breweryArray = breweryArray.concat(brewData);
        this.pageNumber = this.pageNumber + 1;
        this.paginateAPI(this.pageNumber, breweryArray);
      } else {
        console.log('Pagination complete! Ended in page:', this.pageNumber)
        this.breweries = breweryArray;
        console.log(this.breweries);
        this.generateBreweries(this.breweries)
      }
      
    })
  }

  generateBreweries(breweryArray : any[]) {
    let geometryCollection : any[]= []

    var simpleMarker = new SimpleMarkerSymbol({
      color: [226, 119, 40], // RGB color
      outline: {
        color: [255, 255, 255], // White outline
        width: 1
      },
      size: 12,
      style: "circle" // Possible styles: "circle", "square", "cross", "x", "triangle", "diamond"
    });

    breweryArray.forEach((brewery) => {
      const lat = brewery.latitude
      const long = brewery.longitude;

      if (lat === null || long === null) {
        // geocodedBrewery = geocodeBrewery(brewrery);
        // lat = geocodeBrewery.lat;
        // long = geocodeBrewry.long;
      }

      const breweryPoint = new Point({
        latitude: lat,
        longitude: long,
        spatialReference: SpatialReference.WGS84
      });

      const breweryGraphic = new Graphic({
        geometry: breweryPoint,
        symbol: simpleMarker
      })
      geometryCollection.push(breweryGraphic)
    }
  
  );
    const layer = new FeatureLayer({
      source: geometryCollection,
      title: 'Austin Breweries',
      fields: [{
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "place",
        alias: "Place",
        type: "string"
      }],
      objectIdField: "ObjectID",
      geometryType: "point"
    });

    const arcgisMap : HTMLArcgisMapElement | null = document.querySelector("arcgis-map");
    
    if (arcgisMap){
      arcgisMap?.addLayer(layer);
    }
    
  };

async geocodeBrewery(brewery : any) {
  const breweryAddress = brewery.address_1.replace(' ', '+');
  const breweryCity = brewery.city.replace(' ','+');
  const breweryState = brewery.state.replace(' ','+');

  const address = (breweryAddress) ? `?street=${breweryAddress}` : '';
  const city = (breweryCity) ? `&city=${breweryCity}` : '';
  const state = (breweryState) ? `&state=${breweryState}` : '';

  const baseURL = 'https://geocoding.geo.census.gov/geocoder/locations/address';
  const params = address+city+state;
  const endParams = '&format=json&benchmark=4';


}

  arcgisViewReadyChange(event: CustomEvent) {
    this.paginateAPI(this.pageNumber, this.breweries);   
    const arcgisMap : HTMLArcgisMapElement | null = document.querySelector("arcgis-map");
    console.log('Map view is ready!');
  }
}
