import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: any, arg?: string): string {
    if (arg == 'id') {
      return value.length > 3 ? value.substring(0, 3).trim().toUpperCase() : value.toUpperCase();
    }
    if (typeof value == 'string') {
      return value.length > 30 ? value.substring(0, 30).trim().concat(' ...') : value;
    }
    return value;
  }

}
