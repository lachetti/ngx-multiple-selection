import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { NgxMultipleSelectionItemDirective } from './ngx-multiple-selection-item.directive';

interface IPoint {
  x: number;
  y: number;
}

@Directive({
  selector: '[ngxMultipleSelectionZone]'
})
export class NgxMultipleSelectionZoneDirective implements AfterContentInit {
  @Output() public selectedItemsChange = new EventEmitter<unknown[]>();
  @ContentChildren(NgxMultipleSelectionItemDirective, {descendants: true}) childrenItems!: QueryList<NgxMultipleSelectionItemDirective>;

  #selectableItems: NgxMultipleSelectionItemDirective[] = [];
  #selectedItems: Set<NgxMultipleSelectionItemDirective> = new Set();
  #zoneRect: DOMRect = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  } as DOMRect;

  #selection = {
    isVisible: false,
    startPoint: { x: 0, y: 0 },
    element: this.renderer.createElement("div"),

    hide: (): void => {
      this.#selection.isVisible = false;
      this.#selection.element.style.display = 'none';
    },

    show: (): void => {
      this.#selection.isVisible = true;
      this.#selection.element.style.display = 'block';
    },

    resize: (startPoint: IPoint, endPoint: IPoint): void => {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;

      this.#selection.element.style.left = (width < 0 ? endPoint.x : startPoint.x)  + 'px';
      this.#selection.element.style.top = (height < 0 ? endPoint.y : startPoint.y)  + 'px';
      this.#selection.element.style.width = Math.abs(width) + 'px';
      this.#selection.element.style.height = Math.abs(height) + 'px';
    },
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.el.nativeElement.style.position = 'relative';
    this.#selection.element.style.position = 'absolute';
    this.#selection.element.style['background-color'] = 'rgba(0, 0, 255, 0.1)';
    this.#selection.element.style['border'] = 'solid 1px blue';
  }

  @HostListener('mousedown', ['$event']) onMouseDown($event: MouseEvent): void {
    const targetItem = this.#selectableItems
      .find((item) => item.nativeElement.contains($event.target as Node));

    if (!targetItem) {
      this.#startSelection($event);

      return;
    }

    if ($event.ctrlKey) {
      this.#toggleSelection(targetItem);
      this.#emitSelectedItemsData();

      return;
    }

    if (!targetItem.isSelected) {
      this.#deselectAll();
      this.#select(targetItem);
      this.#emitSelectedItemsData();

      return;
    }
  }

  #emitSelectedItemsData(): void {
    const data = [...this.#selectedItems]
      .map((item) => item.ngxMultipleSelectionItem);

    this.selectedItemsChange.emit(data);
  }

  #startSelection($event: MouseEvent): void {
    this.#deselectAll();

    this.#zoneRect = this.el.nativeElement.getBoundingClientRect();
    this.#selection.startPoint = { x: $event.clientX, y: $event.clientY };
    this.#selection.resize(this.#selection.startPoint, this.#selection.startPoint);
    this.#selection.show();

    document.addEventListener('mouseup', this.#mouseUpHandler, { once: true });
    document.addEventListener('mousemove', this.#mouseMoveHandler);

    $event.stopPropagation();
    $event.preventDefault();
  }

  #endSelection(): void {
    const selectionBorders = this.#selection.element.getBoundingClientRect();
    const selectingItems = this.#selectableItems.filter((item) =>
      this.#isIntersects(selectionBorders, item.nativeElement.getBoundingClientRect())
    );

    if (selectingItems.length) {
      selectingItems.forEach((item) => this.#select(item));

      this.#emitSelectedItemsData();
    }

    document.removeEventListener('mousemove', this.#mouseMoveHandler);

    this.#selection.hide();
  }

  #onMouseMove($event: MouseEvent): void {
    const leftBorder = this.#zoneRect.x - this.#zoneRect.left;
    const rightBorder = leftBorder + this.#zoneRect.width;
    const topBorder = this.#zoneRect.y - this.#zoneRect.top;
    const bottomBorder = topBorder + this.#zoneRect.height;

    const x = $event.clientX > rightBorder
      ? rightBorder
      : $event.clientX < leftBorder
        ? leftBorder
        : $event.clientX;

    const y = $event.clientY > bottomBorder
      ? bottomBorder
      : $event.clientY < topBorder
        ? topBorder
        : $event.clientY;

    this.#selection.resize(
      this.#selection.startPoint,
      { x, y }
    );
  }

  #isIntersects(box1: DOMRect, box2: DOMRect): boolean {
    return (
      ( (box1.left <= box2.left && box2.left <= box1.right) ||
        (box2.left <= box1.left && box1.left <= box2.right) ) &&
      ( (box1.top <= box2.top && box2.top <= box1.bottom) ||
        (box2.top <= box1.top && box1.top <= box2.bottom) )
    );
  }

  #select(item: NgxMultipleSelectionItemDirective): void {
    item.isSelected = true;
    this.#selectedItems.add(item);
  }

  #deselect(item: NgxMultipleSelectionItemDirective): void {
    item.isSelected = false;
    this.#selectedItems.delete(item);
  }

  #toggleSelection(item: NgxMultipleSelectionItemDirective): void {
    item.isSelected = !item.isSelected;

    if (item.isSelected) {
      this.#select(item);

    } else {
      this.#deselect(item);
    }
  }

  #deselectAll(): void {
    this.#selectableItems
      .forEach((item) => item.isSelected = false);

    this.#selectedItems.clear();
  }

  #mouseUpHandler = (): void => this.#endSelection();
  #mouseMoveHandler = (e: MouseEvent): void => this.#onMouseMove(e);

  ngAfterContentInit() {
    this.#zoneRect = this.el.nativeElement.getBoundingClientRect();
    this.#selectableItems = this.childrenItems.toArray();
    this.renderer.appendChild(this.el.nativeElement, this.#selection.element);
    this.#selection.hide();

    this.childrenItems.changes.subscribe((changes) => {
      this.#selectableItems = changes.toArray();
    });
  }
}
