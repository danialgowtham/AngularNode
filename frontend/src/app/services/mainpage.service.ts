import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class mainPageService {
  user_name = new BehaviorSubject('');

  setUserName(user_name: string) {
    this.user_name.next(user_name);
  }
}
