import { TestBed } from '@angular/core/testing';

import { PaymentValidationService } from './payment-validation.service';

describe('PaymentValidationService', () => {
  let service: PaymentValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
