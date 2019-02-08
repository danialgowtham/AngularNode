import {Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';
@Component({
    selector: 'popup-modal',
    templateUrl: 'popup-modal.html',
  })
  export class PopupModalComponent {
  
    constructor(public dialogRef: MatDialogRef<PopupModalComponent>){}
    onNoClick(type): void {
      this.dialogRef.close(type);
    }
  
  }