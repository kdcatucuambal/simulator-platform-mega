import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'btnNvgStatus'
})
export class BtnNvgStatusPipe implements PipeTransform {

  transform(value: any, arg1: number, arg2: number): string {


    if (value['selectedOption'] == -1){
      return 'btn-custom'
    }

    if (arg1 == arg2){
      return 'btn-current';
    }

    return 'btn-responded';
  }

}
