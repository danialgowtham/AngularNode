import { MatCardModule,MatButtonModule, MatInputModule,MatSelectModule,MatBottomSheetModule,MatDialogModule,MatTabsModule} from '@angular/material';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import {EmployeeSkillMappingComponent} from './employee-skill-mapping.component'
import {RowComponent} from './dynamic-row/row.component'
import {SkillList} from './dynamic-row/row.component'
import {EmployeeSkillMappingService} from '../services/employee_skill_mapping.service';
import {SkillDataService} from '../shared/skill.data';
import {PopupModalComponent} from "../popup-modal/popup-modal"

@NgModule({
    imports: [MatDialogModule,CommonModule,ReactiveFormsModule,MatCardModule,MatButtonModule, MatInputModule,MatSelectModule,MatBottomSheetModule, MatTabsModule],
    declarations: [ RowComponent,EmployeeSkillMappingComponent,SkillList,PopupModalComponent],
    providers:[EmployeeSkillMappingService,SkillDataService],
    entryComponents: [RowComponent,SkillList,PopupModalComponent], // Add the DialogComponent as entry component
  })
  export class EmployeeSkillMappingModule {}