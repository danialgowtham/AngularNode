import { Injectable } from '@angular/core';

@Injectable()
export class sharedData {
    employee_id:number;
    training_id:String;

    setEmployeeId(employee_id: number) {
        this.employee_id=employee_id;
    }
    getEmployeeId(){
        return this.employee_id;
    }
    setTrainingId(training_id:String){
        this.training_id=training_id;
    }
    getTrainingId(){
        return this.training_id;
    }
}
