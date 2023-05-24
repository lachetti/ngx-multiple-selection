import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMultipleSelectionZoneDirective } from './directives/ngx-multiple-selection-zone.directive';
import { NgxMultipleSelectionItemDirective } from './directives/ngx-multiple-selection-item.directive';

@NgModule({
  declarations: [
    NgxMultipleSelectionZoneDirective,
    NgxMultipleSelectionItemDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxMultipleSelectionZoneDirective,
    NgxMultipleSelectionItemDirective
  ]
})
export class NgxMultipleSelectionModule { }
