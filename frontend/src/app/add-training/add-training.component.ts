import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TrainingService } from '../services/training_service';
import { sharedData } from '../shared/shared.data';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Row } from './dynamic-row/row';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
// import validation from '../error_json/add_training_validation.json';


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddTrainingComponent implements OnInit {
  training_detail_formdata_save: FormGroup;
  training_detail_formdata_submit;
  training_id: String;
  minDate: Date;
  maxDate: Date;
  bands: any;
  units: any;
  locations: any;
  // validations:any;
  rowId: number = 0;
  @Output() rowList: Row[];
  //For File Uplaod
  fileToUpload: File = null;


  training_detail: any = {
    'title': '', 'venue': '', 'date': '', 'band': '', 'unit': '', 'program_detail': '', 'trainer_name': '', 'nomination_type':
      '', 'maximum_nomination': ''
  };

  constructor(private dialog :MatDialog ,private router: Router, private training_service: TrainingService, private share_data_service: sharedData, private formBuilder: FormBuilder) {
    this.rowList = [];
  }
  //validation
  ngOnInit() {
    //setting mindate
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 7);

    //setting maxdate
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);



    //errror Json 
    // this.validations=validation;
    this.training_detail_formdata_submit = this.formBuilder.group({
      form_data_save: this.formBuilder.group({
        title: new FormControl("", [Validators.required]),
        venue: new FormControl("", [Validators.required]),
        date: new FormControl("", [Validators.required]),
      }),
      band: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      trainer_name: new FormControl(""),
      program_detail: new FormControl("", [Validators.required]),
      nomination_type: new FormControl("", [Validators.required]),
      maximum_nomination: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{1,3}$')]),
    });

    this.training_detail_formdata_save = this.training_detail_formdata_submit.get('form_data_save')

    this.training_service.getBand()
      .subscribe(
        response => {
          this.bands = response
        }
      );
    this.training_service.getUnit()
      .subscribe(
        response => {
          this.units = response
        }
      )
    this.training_service.getLoction()
      .subscribe(
        response => {
          this.locations = response
        }
      )

    this.training_id = this.share_data_service.getTrainingId();
    if (this.training_id) {
      this.training_service.getTrainingById(this.training_id)
        .subscribe(
          response => {
            this.training_detail = response[0];
            this.training_detail_formdata_submit.patchValue({
              form_data_save: {
                title: this.training_detail.title,
                venue: this.training_detail.venue,
                date: moment(this.training_detail.date),
              },
              band: this.training_detail.band,
              unit: this.training_detail.unit,
              trainer_name: this.training_detail.trainer_name,
              program_detail: this.training_detail.program_detail,
              nomination_type: this.training_detail.nomination_type,
              maximum_nomination: this.training_detail.maximum_nomination
            })

          })
    } else {
      this.onAddNew();
    }



  }


  onClickSubmit(data, type) {
    var training_data = data.form_data_save;
    delete data.form_data_save;
    training_data = Object.assign(training_data, data);//join two json object
    training_data['status'] = type;
    if (this.training_id) {
      this.training_service.updateTraing(training_data, this.training_id)
        .subscribe(
          data => {
            this.router.navigate(['/training_list']);
          },
          error => {

          }
        );
    } else {
      this.training_service.createTraining(training_data)
        .subscribe(
          data => {
            this.router.navigate(['/training_list']);
          },
          error => {

          }
        );
    }
  }

  onDeleteRow(row: Row) {
    this.rowList = this.rowList.filter(rowObj => rowObj.id != row.id);
  }

  onAddNew() {

    this.rowId++;
    this.rowList.push(
      {
        id: this.rowId,
        date: new Date(),
        start_time: {
          hours: 0,
          minutes: 0
        },
        finish_time: {
          hours: 0,
          minutes: 0
        },
        duration: {
          hours: 0,
          minutes: 0
        }
      }
    );
  }

 

  multipleFileUpload(){
    let dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });
  }
  individualFileUpload(file: FileList){
    console.log(file);
    console.log(file.item(0));
    const formData = new FormData();
    formData.append("file", file.item(0));
    this.training_service.individual_upload(formData)
      .subscribe(
        data => {
         console.log('success');
        },
        error => {
          console.log('error');          
        }
      );
  }

}
