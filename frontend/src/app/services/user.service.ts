import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BACK_END_URL} from '../shared/app.globals'

import { User } from '../models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getUsers(page_number:number) {       
        return this.http.get<User[]>(BACK_END_URL+`users/getUsers/`+page_number);
    }

    getById(id: number) {
        return this.http.get(BACK_END_URL+`users/` + id);
    }

    createUser(user: User) {
        return this.http.post(BACK_END_URL+`users/register`, user);
    }

    update(user: User) {
        return this.http.put(BACK_END_URL+`users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(BACK_END_URL+`users/` + id);
    }

    //For API Call
    getNASAAPOD(){
        return this.http.post(BACK_END_URL+`users/getNasaData`,'');
    }
}