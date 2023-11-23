import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from 'app/utils/utils';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (value) {
      return Utils.formatNumberForUI(value as number);
    } else {
      return 0;
    }
  }
}
