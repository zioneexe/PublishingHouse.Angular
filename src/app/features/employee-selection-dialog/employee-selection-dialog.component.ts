import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-selection-dialog',
  templateUrl: './employee-selection-dialog.component.html',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class EmployeeSelectionDialogComponent {
  selectedEmployee: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { employees: any[] }) {}
}
