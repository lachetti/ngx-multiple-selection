# Angular Multiple Selection Module
A library that allows using two directives to implement multiple selection of elements

##Installation

###Using npm
```
npm install angular-multiple-selection
```

##Usage
* Add the module to the imports in the module where the multiple-selection will be used `imports: [NgxMultipleSelectionModule]`

* Add `ngxMultipleSelectionZone` attribute to element where selectable items will be located
```html
<div ngxMultipleSelectionZone>
  //Add selectable items here
</div>
```

* Add `selectedItemsChange` attribute to set output handler ($event is array of selected items data)
```html
<div ngxMultipleSelectionZone
  (selectedItemsChange)="onSelectItems($event)"
>
  //Add selectable items here
</div>
```

* Add `ngxMultipleSelectionItem` attribute to each selectable item and pass data to this attribute
```html
<div ngxMultipleSelectionZone
  (selectedItemsChange)="onSelectItems($event)"
>
  <div [appMultipleSelectionItem]="1">1</div>
  <div [appMultipleSelectionItem]="2">2</div>
  <div [appMultipleSelectionItem]="3">3</div>
</div>
```

* You can set variable `#selectableItem` to see if an item is selected
```html
<div ngxMultipleSelectionZone
  (selectedItemsChange)="onSelectItems($event)"
>
  <div [appMultipleSelectionItem]="1"
    #selectableItem="selectableItem"
    [class.selected]="selectableItem.isSelected"
  >1</div>
</div>
```

##API
`import { NgxMultipleSelectionModule } from 'ngx-multiple-selection-module'`<br>
Zone selector: `ngxMultipleSelectionZone`
Item selector: `ngxMultipleSelectionItem`

Each selectable item has it`s own angular scope with variables
####ngxMultipleSelectionItem scope
| Name          | Type    | Description                |
| ------------- | ------- | -------------------------- |
| isSelected    | boolean | `true` if element selected |
| nativeElement | Element | Element reference          |

####ngxMultipleSelectionItem @Input()
| Input                    | Type | Description                                           |
| ------------------------ | ---- | ----------------------------------------------------- |
| ngxMultipleSelectionItem | T    | Data will be passed with `selectedItemsChange` Output |

####ngxMultipleSelectionItem @Output()
| Input               | Type | Description                                                          |
| ------------------- | ---- | -------------------------------------------------------------------- |
| selectedItemsChange | T[]  | Emits on change selection and represent array of selected items data |
