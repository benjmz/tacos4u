import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@esri/calcite-components/components/calcite-card';
import '@esri/calcite-components/components/calcite-chip';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListComponent {

}
