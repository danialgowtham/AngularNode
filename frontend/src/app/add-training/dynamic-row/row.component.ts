import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Row } from './row'

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styles: [`width:100%`]
})
export class RowComponent {
  @Output() onRemove = new EventEmitter<any>();

  @Output() add_from_child = new EventEmitter<Boolean>();

  @Input() row: Row;

  @Input() row_length: number;

  onRemoveRow(row: Row): void {
    this.onRemove.emit(row);
  }

}

