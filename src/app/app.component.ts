import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './features/map/map.component';
import { HeaderComponent } from './features/header/header.component';
import "@esri/calcite-components";
import "@esri/calcite-components/dist/calcite/calcite.css";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tacos4u';
}
