import { Injectable } from '@angular/core';
import { NgxMultipleSelectionZoneDirective } from './directives/ngx-multiple-selection-zone.directive';
import { NgxMultipleSelectionItemDirective } from './directives/ngx-multiple-selection-item.directive';

@Injectable({
  providedIn: 'root'
})
export class NgxMultipleSelectionService {
  selectableItemsGroups = new Map<NgxMultipleSelectionZoneDirective, Set<NgxMultipleSelectionItemDirective>>();
  #freeItems: Set<NgxMultipleSelectionItemDirective> = new Set();

  constructor() {
    //
  }

  addGroup(zone: NgxMultipleSelectionZoneDirective) {
    if (this.selectableItemsGroups.has(zone)) {
      return;
    }

    this.selectableItemsGroups.set(zone, new Set());
    this.#flushItems();
  }

  removeGroup(zone: NgxMultipleSelectionZoneDirective) {
    this.selectableItemsGroups.delete(zone);
  }

  addItemToGroup(item: NgxMultipleSelectionItemDirective) {
    this.#getGroupForItem(item).add(item);
  }

  removeItemFromGroup(item: NgxMultipleSelectionItemDirective) {
    this.#getGroupForItem(item).delete(item);
  }

  #getGroupForItem(item: NgxMultipleSelectionItemDirective): Set<NgxMultipleSelectionItemDirective> {
    const itemsZone = [...this.selectableItemsGroups.keys()]
      .find((zone) =>
        zone.nativeElement.contains(item.nativeElement)
      );

    return (itemsZone && this.selectableItemsGroups.get(itemsZone)) || this.#freeItems;
  }

  #flushItems(): void {
    if (!this.#freeItems.size) {
      return;
    }

    [...this.#freeItems].forEach((item) => {
      if (this.#getGroupForItem(item) !== this.#freeItems) {
        this.addItemToGroup(item);
        this.#freeItems.delete(item);
      }
    });
  }
}