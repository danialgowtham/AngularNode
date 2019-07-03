import { Component, Inject, Output} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'employee-view-popup',
  templateUrl: 'employee-view-popup.html',
  styles: ['.back_button{display: flex;justify-content:flex-end;}']
})
export class EmployeeViewPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public employee_id: any, public dialogRef: MatDialogRef<EmployeeViewPopupComponent>, ) { };
  @Output() selected_employee_id: any=this.employee_id;
  ngOnInit() {
    console.log(this.selected_employee_id)
  }

  closeDialog() {
    this.dialogRef.close();
  }

}