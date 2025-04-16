import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';

@Component({
  selector: 'app-header',
  imports: [ ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {

}
