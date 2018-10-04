import { Injectable } from '@angular/core';

@Injectable()
export class sharedData {
    employee_id:number;

    setEmployeeId(employee_id: number) {
        this.employee_id=employee_id;
    }
    getEmployeeId(){
        return this.employee_id;
    }
}
