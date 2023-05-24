import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Renderer2 } from '@angular/core';
import { NgxMultipleSelectionZoneDirective } from './ngx-multiple-selection-zone.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxMultipleSelectionItemDirective } from './ngx-multiple-selection-item.directive';

@Component({
  template: `
    <div ngxMultipleSelectionZone
      (selectedItemsChange)="onSelectItems($event)"
    >
      <div [ngxMultipleSelectionItem]="1"
        #selectableItem="selectableItem"
        [class.selected]="selectableItem.isSelected"
      >1</div>
      <div [ngxMultipleSelectionItem]="2"
        #selectableItem="selectableItem"
        [class.selected]="selectableItem.isSelected"
      >2</div>
      <div [ngxMultipleSelectionItem]="3"
        #selectableItem="selectableItem"
        [class.selected]="selectableItem.isSelected"
      >3</div>
    </div>`,
})
class TestComponent {
  onSelectItems($event: unknown[]) {}
}

describe('NgxMultipleSelectionZoneDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement;
  let des: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [NgxMultipleSelectionZoneDirective, NgxMultipleSelectionItemDirective, TestComponent],
      providers: [Renderer2],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .createComponent(TestComponent);

      fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(NgxMultipleSelectionZoneDirective));
    des = fixture.debugElement.queryAll(By.directive(NgxMultipleSelectionItemDirective));
  });

  it('should create an instance', () => {
    expect(el).toBeTruthy();
  });
});
