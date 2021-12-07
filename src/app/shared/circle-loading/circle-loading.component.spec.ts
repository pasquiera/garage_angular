import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleLoadingComponent } from './circle-loading.component';

describe('CircleLoadingComponent', () => {
  let component: CircleLoadingComponent;
  let fixture: ComponentFixture<CircleLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
