import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxMultipleSelectionService } from '../ngx-multiple-selection.service';

@Directive({
  selector: '[ngxMultipleSelectionItem]',
  exportAs: 'selectableItem',
})
export class NgxMultipleSelectionItemDirective implements OnDestroy, OnInit {
  @Input() ngxMultipleSelectionItem: unknown;

  isSelected = false;
  nativeElement: Element;

  constructor(private el: ElementRef, private service: NgxMultipleSelectionService) {
    this.nativeElement = this.el.nativeElement;
  }

  ngOnInit(): void {
    this.service.addItemToGroup(this);
  }

  ngOnDestroy(): void {
    this.service.removeItemFromGroup(this);
  }
}
