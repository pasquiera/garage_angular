import { TestBed } from '@angular/core/testing';

import { CarGuard } from './car.guard';

describe('CarGuard', () => {
  let guard: CarGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CarGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
