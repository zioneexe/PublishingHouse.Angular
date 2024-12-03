import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyUAH'
})
export class CurrencyUAHPipe implements PipeTransform {
  transform(value: number | string, decimalPlaces: number = 2): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      return 'Invalid price';
    }

    return `${numericValue.toFixed(decimalPlaces)} ₴`;
  }
}
