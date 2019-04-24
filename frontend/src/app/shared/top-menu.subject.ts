import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject  } from 'rxjs';

@Injectable()
export class TopmenuService {
    private subject = new BehaviorSubject <any>("home");

    setActiveTab(type: any) {
        this.subject.next(type);
    }

    clearActiveTab() {
        this.subject.next("");
    }

    getActiveTab(): Observable<any> {
        return this.subject.asObservable();
    }
}