import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray',
  standalone: true,
})
export class EnumToArrayPipe implements PipeTransform {
  transform(value: any, valueIsNumber = true) {
    const keys = Object.keys(value);
    return (valueIsNumber ? keys.slice(keys.length / 2) : keys).map((key) => ({
      key,
      value: value[key],
    }));
  }
}
