import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderModalComponent } from './order-modal/order-modal.component';

@NgModule({
  declarations: [OrderModalComponent],
  imports: [CommonModule, CommonModule, ReactiveFormsModule],
  exports: [OrderModalComponent],
})
export class SharedModule {}
