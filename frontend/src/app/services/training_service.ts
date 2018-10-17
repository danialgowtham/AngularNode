import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BACK_END_URL } from '../shared/app.globals';




@Injectable()
export class TrainingService {
    constructor(private http: HttpClient) { }
    getTrainings(trainingData) {
        console.log(trainingData);
        let params = new HttpParams();
        params = params.append('page_no', trainingData.page_number ? trainingData.page_number : '');
        params = params.append('title', trainingData.title ? trainingData.title : '');
        params = params.append('nom_type', trainingData.nomination_type ? trainingData.nomination_type : '');
        params = params.append('type', trainingData.type ? trainingData.type : '');
        var options={ params: params, responseType: (trainingData.type) ? 'blob' : 'json'};
        console.log(options);
         return this.http.get(BACK_END_URL + `training_calanders/getTrainings/`,options )
    }

    getTrainingById(id: String) {
        return this.http.get(BACK_END_URL + `training_calanders/` + id);
    }

    createTraining(training_data) {
        return this.http.post<any>(BACK_END_URL + `training_calanders/createTraining`, training_data);
    }

    updateTraing(training_data, id) {
        return this.http.put(BACK_END_URL + `training_calanders/` + id, training_data);
    }
    getBand() {
        return this.http.get(BACK_END_URL + `training_calanders/get_bands`);
    }
    getUnit() {
        return this.http.get(BACK_END_URL + `training_calanders/get_units`);
    }
    getLoction() {
        return this.http.get(BACK_END_URL + `training_calanders/get_locations`);
    }

    exportExcel(trainingData) {
        console.log(trainingData);
        let params = new HttpParams();
        params = params.append('title', trainingData.title ? trainingData.title : '');
        params = params.append('nom_type', trainingData.nomination_type ? trainingData.nomination_type : '');
        return this.http.get(BACK_END_URL + `training_calanders/exportTrainings/`, { params: params, responseType: 'blob' })
    }

    //individual Upload
    individual_upload(file) {
        var headers = new Headers();
        return this.http.post(BACK_END_URL + `training_calanders/upload`, file);
    }

    // public getJSON() {
    //     console.log('inside');
    //     return this.http.get("../error_json/add_training_validation.json")
    //                      .pipe(map(response  => response));
    //                     // .catch((error:any) => console.log(error));

    // }


    public upload(files: Set<File>): { [key: string]: Observable<number> } {
        // this will be the our resulting map
        const status = {};

        files.forEach(file => {
            // create a new multipart-form for every file
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            // create a http-post request and pass the form
            // tell it to report the upload progress
            const req = new HttpRequest('POST', BACK_END_URL, formData, {
                reportProgress: true
            });

            // create a new progress-subject for every file
            const progress = new Subject<number>();

            // send the http-request and subscribe for progress-updates

            let startTime = new Date().getTime();
            this.http.request(req).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    // calculate the progress percentage

                    const percentDone = Math.round((100 * event.loaded) / event.total);
                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {
                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();
                }
            });

            // Save every progress-observable in a map of all observables
            status[file.name] = {
                progress: progress.asObservable()
            };
        });

        // return the map of progress.observables
        return status;
    }
}