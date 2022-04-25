import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alertToBg'
})
export class AlertToBgPipe implements PipeTransform {

  transform(value: string, classValue: string): string {
    return classValue.concat(' ')
      .concat(value.replace('alert', 'bg'));
  }

}
