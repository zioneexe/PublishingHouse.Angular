import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';
import { ModalService } from '../../../../core/services/order-modal.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
  standalone: false
})
export class OrderModalComponent {
  @Output() orderAdded = new EventEmitter<any>();
  orderForm: FormGroup;
  isModalOpen = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private orderService: OrderService , private modalService: ModalService
  ) {
    this.orderForm = this.fb.group({
      bookName: ['', Validators.required],
      authorName: ['', Validators.required],
      genre: ['', Validators.required],
      pages: [0, [Validators.required, Validators.min(1)]],
      publicationYear: [new Date().getFullYear(), [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      printType: ['', Validators.required],
      paperType: ['', Validators.required],
      coverType: ['', Validators.required],
      fasteningType: ['', Validators.required],
      isLaminated: [false],
      completionDate: ['', Validators.required],
    });

    this.modalService.currentModalState.subscribe((state) => {
      this.isModalOpen = state;
    });
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      return;
    }

    const orderData = this.orderForm.value;

    const formData = new FormData();
    formData.append('bookPicture', this.selectedFile as Blob);
    formData.append('orderData', JSON.stringify(orderData));

    this.orderService.addOrder(formData).subscribe({
      next: (addedOrder) => {
        console.log('Order created successfully');
        this.orderAdded.emit(addedOrder); 
        this.closeModal();
      },
      error: (err: any) => {
        console.error('Error creating order:', err);
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
