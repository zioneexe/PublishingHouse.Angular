import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../core/services/order-modal.service';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderRequestService } from '../../../../core/services/order-request.service';
import { firstValueFrom } from 'rxjs';
import { OrderRequest } from '../../../../core/models/OrderRequest';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
  standalone: false,
})
export class OrderModalComponent {
  @Output() orderAdded = new EventEmitter<void>();

  orderForm: FormGroup;
  isModalOpen = false;
  selectedFile: File | null = null;
  uploadedFilePath: string | null = null;

  constructor(
    private fb: FormBuilder,
    private orderRequestService: OrderRequestService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.orderForm = this.fb.group({
      bookName: ['', Validators.required],
      authorName: ['', Validators.required],
      genre: ['', Validators.required],
      publicationYear: [new Date().getFullYear(), Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      printType: ['', Validators.required],
      paperType: ['', Validators.required],
      coverType: ['', Validators.required],
      fasteningType: ['', Validators.required],
      isLaminated: [false],
      completionDate: ['', Validators.required],
      bookPicture: [null],
    });

    this.modalService.currentModalState.subscribe((state) => {
      this.isModalOpen = state;
    });
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.orderForm.patchValue({ bookPicture: this.selectedFile.name });
      this.orderForm.get('bookPicture')?.updateValueAndValidity();
    }
  }

  async uploadFile(): Promise<string | null> {
    if (!this.selectedFile) {
      return Promise.resolve(null);
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const response = await firstValueFrom(this.orderRequestService.uploadFile(formData));
    this.uploadedFilePath = response.filePath;

    return response.filePath;
  }

  async onSubmit(): Promise<void> {
    if (this.orderForm.invalid) {
      return;
    }

    try {
      const filePath = await this.uploadFile();
      console.log(filePath);

      const orderRequest : OrderRequest = {
        customerId: this.authService.getUserId(),
        bookName: this.orderForm.value.bookName,
        authorName: this.orderForm.value.authorName,
        genre: this.orderForm.value.genre,
        pages: this.orderForm.value.pages,
        publicationYear: this.orderForm.value.publicationYear,
        quantity: this.orderForm.value.quantity,
        printType: this.orderForm.value.printType,
        paperType: this.orderForm.value.paperType,
        coverType: this.orderForm.value.coverType,
        fasteningType: this.orderForm.value.fasteningType,
        isLaminated: this.orderForm.value.isLaminated,
        completionDate: this.orderForm.value.completionDate,
        coverImagePath: filePath || '',
      };

      this.orderRequestService.createOrderRequest(orderRequest).subscribe({
        next: (response) => {
          if (response === null) {
            console.log('Order created successfully.');
          } else {
            console.log('Order created successfully:', response);
          }
          this.orderAdded.emit();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          alert(`Failed to create order. Error: ${err.message || 'Unknown error'}`);
        },
      });
    } catch (err) {
      console.error('Error during file upload or order creation:', err);
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
