import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentValidationService {
  validateCardNumber(cardNumber: string): boolean {
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    const parity = cardNumber.length % 2;
  
    for (let i = cardNumber.length - 2; i >= 0; i--) {
      const digit = parseInt(cardNumber[i], 10);
      if (isNaN(digit)) {
        return false;
      }
  
      let adjustedDigit = digit;
      if (i % 2 === parity) {
        adjustedDigit *= 2;
        if (adjustedDigit > 9) {
          adjustedDigit -= 9;
        }
      }
  
      sum += adjustedDigit;
    }
  
    const checkDigit = parseInt(cardNumber[cardNumber.length - 1], 10);
    return ((10 - (sum % 10)) % 10) === checkDigit;
  }

  validateExpiryDate(expiryDate: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);

    if (!month || !year || month < 1 || month > 12) {
      return false;
    }

    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2), 10);
    const currentMonth = currentDate.getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
  }

  validateCVV(cvv: string): boolean {
    return /^\d{3}$/.test(cvv);
  }
}
