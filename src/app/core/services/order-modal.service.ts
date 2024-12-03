import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpenSource = new BehaviorSubject<boolean>(false);
  currentModalState = this.isModalOpenSource.asObservable();

  openModal() {
    this.isModalOpenSource.next(true);
  }

  closeModal() {
    this.isModalOpenSource.next(false);
  }
}
