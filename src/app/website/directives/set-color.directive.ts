import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appSetColor]'
})
export class SetColorDirective {

  @Input() isCorrect = false;

  constructor(
    private element: ElementRef<HTMLDivElement>
  ) {

  }


  // @HostListener('click') onClick(){
  //   if (this.isCorrect){
  //     this.element.nativeElement.style.backgroundColor = 'green';
  //   }else{
  //     this.element.nativeElement.style.backgroundColor = 'red';
  //   }
  // }


}
