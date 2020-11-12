import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash-es';

@Pipe({
  name: 'roleFilter'
})
export class RoleFilterPipe implements PipeTransform {
  transform(items: any[], selected: String): any {
    if (!items || !selected) {
      return items;
    }
    let newData = items;
    if(selected === 'Select Role'){
      newData = items.filter(item => item.name != 'NONE');
    }
     return newData;
  }
}
