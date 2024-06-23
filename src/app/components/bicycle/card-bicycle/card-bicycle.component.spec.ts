import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBicycleComponent } from './card-bicycle.component';

describe('CardBicycleComponent', () => {
  let component: CardBicycleComponent;
  let fixture: ComponentFixture<CardBicycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBicycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBicycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
