import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators,FormGroup } from '@angular/forms';
import { TrainingService } from '../services/training_service';
import { sharedData } from '../services/shared.data';
import { first } from 'rxjs/operators';
import { Router} from '@angular/router';
// import validation from '../error_json/add_training_validation.json';


@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.css']
})
export class AddTrainingComponent implements OnInit {
  training_detail_formdata_save:FormGroup;
  training_detail_formdata_submit;
  training_id: String;
  minDate: Date;
  maxDate:Date;
  bands:any;
  units:any;
  locations:any;
  // validations:any;

  training_detail: any = {
    'title': '', 'venue': '', 'date': '', 'band': '', 'unit': '', 'program_detail': '', 'trainer_name': '', 'nomination_type':
      '', 'maximum_nomination': ''
  };

  constructor(private router:Router,private training_service: TrainingService, private share_data_service: sharedData, private formBuilder: FormBuilder) { }

  //validation
  ngOnInit() {
    //setting mindate
    this.minDate =new Date();
    this.minDate.setDate(this.minDate.getDate()-7);

    //setting maxdate
    this.maxDate=new Date();
    this.maxDate.setMonth(this.maxDate.getMonth()+1);

    

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
      trainer_name:new FormControl(""),
      program_detail: new FormControl("", [Validators.required]),
      nomination_type: new FormControl("", [Validators.required]),
      maximum_nomination: new FormControl("", [Validators.required,Validators.pattern('^[0-9]{1,3}$')]),
    });
    
    this.training_detail_formdata_save = this.training_detail_formdata_submit.get('form_data_save')

    this.training_service.getBand()
              .pipe(first())
              .subscribe(
                response=>{
                  this.bands = response
                }
              );
    this.training_service.getUnit()
              .pipe(first())
              .subscribe(
                response=>{
                  this.units = response
                }
              )
    this.training_service.getLoction()
              .pipe(first())
              .subscribe(
                response=>{
                  this.locations = response
                }
              )

    this.training_id = this.share_data_service.getTrainingId();
    if (this.training_id) {
      this.training_service.getTrainingById(this.training_id)
        .pipe(first())
        .subscribe(
          response => {
            console.log(response);
            this.training_detail = response[0];
            this.training_detail_formdata_submit.patchValue({form_data_save:{
              title: this.training_detail.title,
              venue:  this.training_detail.venue,
              date:  this.training_detail.date,
            },
            band: this.training_detail.band,
            unit:this.training_detail.unit,
            trainer_name:this.training_detail.trainer_name,
            program_detail:this.training_detail.program_detail,
            nomination_type:this.training_detail.nomination_type,
            maximum_nomination: this.training_detail.maximum_nomination
          })
           
          })
    }

  

  }
  
 
  onClickSubmit(data, type) {
    //  (<HTMLInputElement> document.getElementById("save_btn")).disabled = true;   
    var training_data=data.form_data_save;
    delete data.form_data_save;
    training_data= Object.assign(training_data, data);//join two json object
    training_data['status']=type;
    if(this.training_id){
      this.training_service.updateTraing(training_data,this.training_id)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/training_list']);
        },
        error => {
                      
        }
      );
    }else{
      this.training_service.createTraining(training_data)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/training_list']);
        },
        error => {
                      
        }
      );
    }
    console.log(training_data);
   
    

  }

}
