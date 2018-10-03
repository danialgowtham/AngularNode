import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getUsers(page_number:number) {       
        return this.http.get<User[]>(`http://localhost:3695/users/getUsers/`+page_number);
    }

    getById(id: number) {
        return this.http.get(`http://localhost:3695/users/` + id);
    }

    createUser(user: User) {
        console.log(user);
        return this.http.post(`http://localhost:3695/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`http://localhost:3695/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`http://localhost:3695/users/` + id);
    }
}