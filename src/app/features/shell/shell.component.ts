import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-shell-panel';
import '@esri/calcite-components/components/calcite-panel';
import { MapComponent } from '../map/map.component';
import { HeaderComponent } from '../header/header.component';
import { ListComponent } from "../list/list.component";

@Component({
  selector: 'app-shell',
  imports: [MapComponent, HeaderComponent, ListComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShellComponent {

}
