import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { ActivatedRoute } from '@angular/router';
import { BACK_END_URL } from '../shared/app.globals';

@Component({
  selector: 'app-candidate-file-upload',
  templateUrl: './candidate-file-upload.component.html',
  styleUrls: ['./candidate-file-upload.component.css']
})
export class CandidateFileUploadComponent implements OnInit {
  form_data: any;
  maxSize: number = 5242880;
  candidate_id: any;
  BACK_END_URL = BACK_END_URL;
  check_already_upload: Boolean = false;
  accepted_file_exetension = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
  accepted_photo_exetension = ['png', 'jpg', 'jpeg'];
  accepted_cpif_exetension = ['doc', 'docx'];
  constructor(private route: ActivatedRoute, private skill_service: EmployeeSkillMappingService) { }

  ngOnInit() {
    if (this.route.snapshot.params.candidate_id) {
      this.candidate_id = this.route.snapshot.params.candidate_id;
      this.skill_service.checkCandidateDocuments(this.candidate_id)
        .subscribe(
          response => {
            if (response["data"] == true)
              this.check_already_upload = true;
          }
        );
    }
    this.form_data = new FormGroup({
      payslips: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]),
      bank_statement: new FormControl("", [FileValidator.maxContentSize(this.maxSize)]),
      degree_certificates: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]),
      others: new FormControl("", [FileValidator.maxContentSize(this.maxSize)]),
      experience_letter: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]),
      candidate_photo: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]),
      cpif: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]),
    });
    this.form_data.controls.payslips.valueChanges.subscribe(value => {
      if (value) {
        this.form_data.controls.bank_statement.setValidators(null);
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.payslips.setValue(null, { emitEvent: false });
          }
        }
      } else {
        this.form_data.controls.bank_statement.setValidators([Validators.required]);
      }
    });
    this.form_data.controls.bank_statement.valueChanges.subscribe(value => {
      if (value) {
        this.form_data.controls.payslips.setValidators(null);
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.bank_statement.setValue(null, { emitEvent: false });
          }
        }
      }
      else {
        this.form_data.controls.payslips.setValidators([Validators.required]);
      }
    });
    this.form_data.controls.degree_certificates.valueChanges.subscribe(value => {
      if (value) {
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.degree_certificates.setValue(null, { emitEvent: false });
          }
        }
      }
      this.form_data.controls.payslips.updateValueAndValidity();
      this.form_data.controls.bank_statement.updateValueAndValidity();
    });
    this.form_data.controls.others.valueChanges.subscribe(value => {
      if (value) {
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.others.setValue(null, { emitEvent: false });
          }
        }
      }
    });
    this.form_data.controls.experience_letter.valueChanges.subscribe(value => {
      if (value) {
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.experience_letter.setValue(null, { emitEvent: false });
          }
        }
      }
    });
    this.form_data.controls.candidate_photo.valueChanges.subscribe(value => {
      if (value) {
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_photo_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.candidate_photo.setValue(null, { emitEvent: false });
          }
        }
      }
    });
    this.form_data.controls.cpif.valueChanges.subscribe(value => {
      if (value) {
        for (let file of value.files) {
          var uploaded_file_type = file.name.split('.').pop();
          if (!this.accepted_cpif_exetension.includes(uploaded_file_type)) {
            this.form_data.controls.cpif.setValue(null, { emitEvent: false });
          }
        }
      }
    });
  }
  onSubmit() {
    if (this.form_data.status == 'VALID') {
      const formData = new FormData();
      Object.keys(this.form_data.value).forEach((key) => {
        if (this.form_data.value[key])
          for (var i = 0; i < this.form_data.value[key]["files"].length; i++) {
            formData.append(key + "[]", this.form_data.value[key]["files"][i]);
          }
      });
      formData.append("candidate_id", this.candidate_id);
      this.skill_service.uploadCandidateDocuments(formData)
        .subscribe(
          response => {
            this.check_already_upload = true;
          }
        );
    }
  }

}
