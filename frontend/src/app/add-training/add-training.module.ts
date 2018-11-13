import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule, MatTableModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatSelectModule } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { AddTrainingComponent } from './add-training.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule }   from '@angular/forms';
import {RowComponent} from './dynamic-row/row.component';
import { Angular5TimePickerModule } from 'angular5-time-picker';


@NgModule({
  imports: [CommonModule,Angular5TimePickerModule,ReactiveFormsModule, MatButtonModule, MatDialogModule, MatListModule, MatTableModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatSelectModule, BrowserAnimationsModule, MatProgressBarModule],
  declarations: [AddTrainingComponent, DialogComponent,RowComponent],
  entryComponents: [DialogComponent,RowComponent], // Add the DialogComponent as entry component
})
export class AddTrainingModule {}
