import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
  ]
})
export class EditOrderComponent {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      orderNumber: [data.orderNumber, Validators.required],
      printType: [data.printType, Validators.required],
      paperType: [data.paperType, Validators.required],
      coverType: [data.coverType, Validators.required],
      fasteningType: [data.fasteningType, Validators.required],
      isLaminated: [data.isLaminated],
      completionDate: [data.completionDate, Validators.required],
      price: [data.price, [Validators.required, Validators.min(0)]],
    });

    console.log('Dialog data:', data);
  }

  onSave(): void {
    if (this.orderForm.valid) {
      this.dialogRef.close(this.orderForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
