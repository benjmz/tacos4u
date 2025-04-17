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
  breweries : any[] = [];
  pageNumber : number = 1;

  constructor(private beerService: BeerLocationsService, private geocodingService: GeocodingService) {}

  ngOnInit() {}

  paginateAPI(pageNumber : number, breweryArray : any[]) {
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

  async generateBreweries(breweryArray : any[]) {
    let geometryCollection : any[]= [];

    var simpleMarker = new SimpleMarkerSymbol({
      color: [226, 119, 40], 
      outline: {
        color: [255, 255, 255],
        width: 1
      },
      size: 12,
      style: "square" 
    });

    for (var i = 0; i < breweryArray.length; i++) {
      const brewery = breweryArray[i];
      let lat = brewery.latitude;
      let long = brewery.longitude;

      if (lat === null || long === null) {
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

      const breweryGraphic = new Graphic({
        geometry: breweryPoint,
        symbol: simpleMarker
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

  arcgisViewReadyChange(event: CustomEvent) {
    this.paginateAPI(this.pageNumber, this.breweries);   
    console.log('Map view is ready!');
  }
}
