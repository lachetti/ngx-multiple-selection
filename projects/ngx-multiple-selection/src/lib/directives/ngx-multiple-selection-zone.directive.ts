import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { NgxMultipleSelectionItemDirective } from './ngx-multiple-selection-item.directive';
import { NgxMultipleSelectionService } from '../ngx-multiple-selection.service';

interface IPoint {
  x: number;
  y: number;
}

@Directive({
  selector: '[ngxMultipleSelectionZone]'
})
export class NgxMultipleSelectionZoneDirective implements OnInit, OnDestroy {
  @Output() public selectedItemsChange = new EventEmitter<unknown[]>();
  nativeElement: Element;

  #selectableItems!: Set<NgxMultipleSelectionItemDirective>;
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

      this.#selection.element.style.left = (width < 0 ? endPoint.x : startPoint.x) + 'px';
      this.#selection.element.style.top = (height < 0 ? endPoint.y : startPoint.y) + 'px';
      this.#selection.element.style.width = Math.abs(width) + 'px';
      this.#selection.element.style.height = Math.abs(height) + 'px';
    },
  };

  constructor(private el: ElementRef, private renderer: Renderer2, private service: NgxMultipleSelectionService) {
    this.service.addGroup(this);

    this.nativeElement = this.el.nativeElement;
    this.el.nativeElement.style.position = 'relative';
    this.#selection.element.style.position = 'absolute';
    this.#selection.element.style['background-color'] = 'rgba(255,255,255,0.3)';
    this.#selection.element.style['border'] = '1px solid #3b9df9';
    this.#selection.element.classList.add('multiple-selection-rect');
  }

  @HostListener('mousedown', ['$event']) onMouseDown($event: MouseEvent): void {
    const targetItem = [...this.#selectableItems]
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
    const selectingItems = [...this.#selectableItems].filter((item) =>
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
    [...this.#selectableItems]
      .forEach((item) => item.isSelected = false);

    this.#selectedItems.clear();
  }

  #mouseUpHandler = (): void => this.#endSelection();
  #mouseMoveHandler = (e: MouseEvent): void => this.#onMouseMove(e);

  ngOnInit() {
    this.#zoneRect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.appendChild(this.el.nativeElement, this.#selection.element);
    this.#selection.hide();

    const itemsGroup = this.service.selectableItemsGroups.get(this);

    if (itemsGroup) {
      this.#selectableItems = itemsGroup;
    }
  }

  ngOnDestroy(): void {
    this.service.removeGroup(this);
  }
}
