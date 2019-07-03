import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilePicService {
    private subject = new BehaviorSubject<String>('');

    setProfilePic(url: String) {
        this.subject.next(url);
    }

    clearProfile() {
        this.subject.next('');
    }

    getProfilePic(): Observable<String> {
        return this.subject.asObservable();
    }
}