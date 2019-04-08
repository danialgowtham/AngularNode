import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject  } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private subject = new BehaviorSubject <Boolean>(false);

    setLoader(type: Boolean) {
        this.subject.next(type);
    }

    clearMessage() {
        this.subject.next(false);
    }

    getLoader(): Observable<Boolean> {
        return this.subject.asObservable();
    }
}