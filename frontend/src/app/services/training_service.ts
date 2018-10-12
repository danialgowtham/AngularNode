import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
// import { map } from 'rxjs/operators';




@Injectable()
export class TrainingService {
    constructor(private http: HttpClient) { }

    getTrainings(trainingData) {       
        console.log(trainingData);
        let params = new HttpParams();
        params = params.append('page_no', trainingData.page_number?trainingData.page_number:'');
        params = params.append('title', trainingData.title?trainingData.title:'');
        params = params.append('nom_type', trainingData.nomination_type?trainingData.nomination_type:'');
        return this.http.get(`http://localhost:3695/training_calanders/getTrainings/`,{params: params});
    }

    getTrainingById(id: String) {
        return this.http.get(`http://localhost:3695/training_calanders/` + id);
    }

    createTraining(training_data) {
        return this.http.post<any>(`http://localhost:3695/training_calanders/createTraining`, training_data);
    }

    updateTraing(training_data,id) {
        return this.http.put(`http://localhost:3695/training_calanders/` +id, training_data);
    }   
    getBand(){
        return this.http.get(`http://localhost:3695/training_calanders/get_bands`);
    }
    getUnit(){
        return this.http.get(`http://localhost:3695/training_calanders/get_units`);
    }
    getLoction(){
        return this.http.get(`http://localhost:3695/training_calanders/get_locations`);
    }

    // public getJSON() {
    //     console.log('inside');
    //     return this.http.get("../error_json/add_training_validation.json")
    //                      .pipe(map(response  => response));
    //                     // .catch((error:any) => console.log(error));

    // }
}