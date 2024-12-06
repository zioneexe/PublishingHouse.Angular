import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSelectionDialogComponent } from './employee-selection-dialog.component';

describe('EmployeeSelectionDialogComponent', () => {
  let component: EmployeeSelectionDialogComponent;
  let fixture: ComponentFixture<EmployeeSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
