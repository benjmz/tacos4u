import { TestBed } from '@angular/core/testing';

import { BeerLocationsService } from './beer-locations.service';

describe('BeerLocationsService', () => {
  let service: BeerLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeerLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
