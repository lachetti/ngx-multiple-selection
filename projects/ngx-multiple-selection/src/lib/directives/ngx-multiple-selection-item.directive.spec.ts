import { NgxMultipleSelectionItemDirective } from './ngx-multiple-selection-item.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div [ngxMultipleSelectionItem]="1">1</div>
    <div [ngxMultipleSelectionItem]="2">2</div>
    <div [ngxMultipleSelectionItem]="3">3</div>`,
})
class TestComponent {}

describe('NgxMultipleSelectionItemDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [NgxMultipleSelectionItemDirective, TestComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .createComponent(TestComponent);

    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(NgxMultipleSelectionItemDirective));
  });

  it('should create an instance', () => {
    expect(des.length).toBe(3);
  });
});
