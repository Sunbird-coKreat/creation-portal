import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toCharCode'
})
export class ToCharCodePipe implements PipeTransform {
  transform(value: number): string {
    return String.fromCharCode(value);
  }
}
