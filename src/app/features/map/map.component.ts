import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import "@arcgis/map-components/components/arcgis-map";
import '@esri/calcite-components/components/calcite-shell';
import { BeerLocationsService } from '../../services/beer-locations.service';
import { Brewery } from '../types/brewery.dto';
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapComponent implements OnInit {
  breweries : Brewery[] = [];
  pageNumber : number = 1;

  constructor(private beerService: BeerLocationsService, private geocodingService: GeocodingService) {}

  ngOnInit() {}

  paginateAPI(pageNumber : number, breweryArray : Brewery[]) {
    this.beerService.getBeerData(pageNumber).subscribe(brewData => {
      if (brewData.length > 0) {
        breweryArray = breweryArray.concat(brewData);
        this.pageNumber = this.pageNumber + 1;
        this.paginateAPI(this.pageNumber, breweryArray);
      } else {
        console.log('Pagination complete! Ended in page:', this.pageNumber);
        this.breweries = breweryArray;
        console.log(this.breweries);
        this.generateBreweries(this.breweries);
      }
    });
  }

  async generateBreweries(breweryArray : Brewery[]) {
    let geometryCollection : any[]= [];

    var simpleMarker = new SimpleMarkerSymbol({
      color: 'red', 
      size: '12px',
      style: "square" 
    });

    for (var i = 0; i < breweryArray.length; i++) {
      const brewery = breweryArray[i];
      let lat = brewery.latitude;
      let long = brewery.longitude;
      const address = brewery.address_1;

      const latNull = (lat === null);
      const longNull = (long === null);
      const addyNull = (address === null);

      // if (latNull && longNull && addyNull) { return }

      if (latNull || longNull) {
        lat = await this.geocodingService.geocodeBrewery(brewery).then((geocoded : any) => {
            return geocoded.latitude;
          });
        long = await this.geocodingService.geocodeBrewery(brewery).then((geocoded : any) => {
            return geocoded.longitude;
          });
      }

      const breweryPoint = new Point({
        latitude: lat,
        longitude: long,
        spatialReference: SpatialReference.WGS84
      });

      const breweryAttributes = {
        brewery_type: brewery.brewery_type,
        address_1: brewery.address_1,
        address_2: brewery.address_2,
        address_3: brewery.address_3,
        city: brewery.city,
        state_province: brewery.state_province,
        postal_code: brewery.postal_code,
        country: brewery.country,
        longitude: long,
        latitude: lat,
        phone: brewery.phone,
        website_url: brewery.website_url,
        state: brewery.state,
        street: brewery.street,
      }

      const breweryGraphic = new Graphic({
        geometry: breweryPoint,
        symbol: simpleMarker,
        attributes: breweryAttributes
      });

      geometryCollection.push(breweryGraphic);
    };

    const layer = new FeatureLayer({
      source: geometryCollection,
      title: 'Austin Breweries',
      fields: [{
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "brewery_type",
        alias: "Brewery Type",
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

  arcgisViewReadyChange(event: CustomEvent) {
    this.paginateAPI(this.pageNumber, this.breweries);   
    console.log('Map view is ready!');
  }
}
