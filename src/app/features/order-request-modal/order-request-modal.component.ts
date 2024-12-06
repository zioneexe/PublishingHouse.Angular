import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrderRequestService } from '../../core/services/order-request.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-request-edit-modal',
  templateUrl: './order-request-modal.component.html',
  styleUrls: ['./order-request-modal.component.scss'],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class OrderRequestModalComponent implements OnInit {
  orderRequestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderRequestService: OrderRequestService,
    public dialogRef: MatDialogRef<OrderRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderRequestForm = this.fb.group({
      bookName: [data.bookName, [Validators.required]],
      authorName: [data.authorName, [Validators.required]],
      genre: [data.genre, [Validators.required]],
      publicationYear: [data.publicationYear, [Validators.required]],
      quantity: [data.quantity, [Validators.required, Validators.min(1)]],
      printType: [data.printType, [Validators.required]],
      paperType: [data.paperType, [Validators.required]],
      coverType: [data.coverType, [Validators.required]],
      fasteningType: [data.fasteningType, [Validators.required]],
      isLaminated: [data.isLaminated],
      completionDate: [data.completionDate],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.orderRequestForm.valid) {

      const updatedOrderRequest = {
        ...this.data,
        ...this.orderRequestForm.value,
        customerId: this.data.customer.customerId
      };

      console.log(updatedOrderRequest);

      this.orderRequestService
        .updateOrderRequest(updatedOrderRequest.orderRequestId, updatedOrderRequest)
        .subscribe({
          next: () => {
            console.log('Order request updated successfully.');
            this.dialogRef.close(updatedOrderRequest);
          },
          error: (err) => {
            console.error('Error updating order request:', err);
          },
        });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
