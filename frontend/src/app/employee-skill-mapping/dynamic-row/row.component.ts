import { Component, EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeSkillMappingService } from '../../services/employee_skill_mapping.service';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
// import {SkillDataService} from '../../shared/skill.data';


@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styles:['.mat-form-field{display:block !important;}','width:100%']
})
export class RowComponent {
  @Output() onRemove = new EventEmitter<any>();
  @Output() selectedCompetency = new EventEmitter<{ old_value: String, new_value: String }>();
  @Output() selectedCompetecnyList = new EventEmitter<any>();

  @Input() row: { id: Number };
  @Input() overall_competency_list: Array<any>;
  @Input() already_selected_skill:Array<any>;
  selected_sub_practice:String;
  units: any;
  practices: any;
  sub_practices: any;
  competencies: any;
  skills: any;
  skills_with_experience = new Map();
  old_competency_value: String = null;

  row_form_data;
  constructor(private skill_service: EmployeeSkillMappingService, private bottomSheet: MatBottomSheet) { }
  ngOnInit() {
    this.row_form_data = new FormGroup({
      unit: new FormControl("", [Validators.required]),
      practice: new FormControl("", [Validators.required]),
      sub_practice: new FormControl("", [Validators.required]),
      competency: new FormControl("", [Validators.required])
    });
    this.get_units("0", "unit");
  }
  openSkill(): void {
    if (this.row_form_data.status == "VALID") {
      let total_skill = new Map();
      total_skill.set("skills", this.skills);
      if (this.skills_with_experience)
        total_skill.set("skills_with_experience", this.skills_with_experience);
      else
        total_skill.set("skills_with_experience", new Map());
      const bottomSheetRef = this.bottomSheet.open(SkillList, { data: total_skill, disableClose: true }
      );
      bottomSheetRef.afterDismissed().subscribe(result => {
        if (result)
          this.skills_with_experience = result;
        const pass_data = new Map();
        pass_data.set("row_id", this.row.id)
        pass_data.set("competency_list", this.skills_with_experience)
        pass_data.set("sub_practice", this.row_form_data.controls.sub_practice.value)
        this.selectedCompetecnyList.emit(pass_data);
      })
    }
  }
  get_units(parent_id, type) {
    this.skill_service.getUnit(parent_id)
      .subscribe(
        response => {
          if (type == "unit") {
            this.units = response;
            this.practices = [];
            this.sub_practices = [];
            this.competencies = [];
            this.skills = [];
            this.skills_with_experience = new Map();
          }
          else if (type == "practice") {
            this.practices = response;
            this.sub_practices = [];
            this.competencies = [];
            this.skills = [];
            this.skills_with_experience = new Map();

          }
          else {
            this.sub_practices = response;
            this.competencies = [];
            this.skills = [];
            this.skills_with_experience = new Map();

          }

        }
      );
  }
  get_competency(sub_sbu_id) {
    this.skill_service.getCompetency(sub_sbu_id, this.overall_competency_list)
      .subscribe(
        response => {
          this.competencies = response

        }
      );
    this.skills = [];
    this.skills_with_experience = new Map();
  }
  get_skill(com_str_map_id) {
    this.skill_service.getSkill(com_str_map_id,this.already_selected_skill)
      .subscribe(
        response => {
          this.skills = response

        }
      );
    this.selectedCompetency.emit({ old_value: this.old_competency_value, new_value: com_str_map_id })
    this.old_competency_value = com_str_map_id;
    this.skills_with_experience = new Map();
  }
  onRemoveRow(row: { id: Number }): void {
    this.onRemove.emit(row);
  }

}


@Component({
  selector: 'skill-list',
  templateUrl: 'skill-list.html'
})
export class SkillList {
  public skills: any;
  // public skills_with_experience: any;
  constructor(private bottomSheetRef: MatBottomSheetRef, @Inject(MAT_BOTTOM_SHEET_DATA) public total_data: any) { }
  skill_set = new Map();
  ngOnInit() {
    this.skills = this.total_data.get('skills');
    // this.skills_with_experience = this.total_data.get('skills_with_experience');
    this.skill_set = this.total_data.get('skills_with_experience');
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  update_json(com_skl_map_id: Number, experience_month: Number) {
    if (com_skl_map_id && !experience_month && this.skill_set.has(com_skl_map_id))
      this.skill_set.delete(com_skl_map_id)
    else if (com_skl_map_id && experience_month) {
      this.skill_set.set(com_skl_map_id, experience_month)
    }
  }
  dismissBottomSheet() {
    this.bottomSheetRef.dismiss(this.skill_set);
  }
  closeBottomSheet() {
    this.bottomSheetRef.dismiss();
  }




}


