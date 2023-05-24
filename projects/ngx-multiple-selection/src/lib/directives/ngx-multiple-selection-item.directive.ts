import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[ngxMultipleSelectionItem]',
  exportAs: 'selectableItem',
})
export class NgxMultipleSelectionItemDirective {
  @Input() ngxMultipleSelectionItem: unknown;

  isSelected = false;
  nativeElement: Element;

  constructor(private el: ElementRef) {
    this.nativeElement = this.el.nativeElement;
  }
}
