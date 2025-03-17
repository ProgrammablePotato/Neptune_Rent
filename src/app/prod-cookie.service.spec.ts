import { TestBed } from '@angular/core/testing';

import { ProdCookieService } from './prod-cookie.service';

describe('ProdCookieService', () => {
  let service: ProdCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
