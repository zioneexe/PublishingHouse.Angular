import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestModalComponent } from './order-request-modal.component';

describe('OrderRequestModalComponent', () => {
  let component: OrderRequestModalComponent;
  let fixture: ComponentFixture<OrderRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRequestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
