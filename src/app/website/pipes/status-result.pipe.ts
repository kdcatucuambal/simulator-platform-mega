import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusResult'
})
export class StatusResultPipe implements PipeTransform {

  transform(value: number, correct: number, selectedOption: number): string {
   if (selectedOption == value && selectedOption != correct){
     return 'border border-2 border-danger rounded-3';
   }
   if (value == correct || selectedOption == -1 && value == correct){
     return 'border border-2 border-success rounded-3';
   }
    return '';
  }
}
