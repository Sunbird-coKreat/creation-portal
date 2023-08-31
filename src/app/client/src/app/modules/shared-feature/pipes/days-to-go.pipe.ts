import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
// import { text } from '@angular/core/src/render3';

@Pipe({
  name: 'daysToGo'
})
export class DaysToGoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    const date  = moment(moment(value).format('YYYY-MM-DD'));
    const today = moment(moment().format('YYYY-MM-DD'));
    let days    = 0;

    if (date.isAfter(today)) {
        days = date.diff(today, 'days');

        if (days === 0) {
          return '1 day to go';
        } else {
          return days + ((days === 1) ? ' day' : ' days') + ' to go';
        }
    } else {
        days = date.diff(today, 'days');

        if (days !== 0 ) {
          days *= -1;
        }

        if (days === 0) {
          return 'Today';
        } else {
         return days + ((days === 1) ? ' day' : ' days') + ' ago';
        }

    }
  }
}
