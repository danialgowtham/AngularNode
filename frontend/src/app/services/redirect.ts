import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RedirectService {
    constructor(private router: Router) { }

    change_page(page_link) {
        console.log(page_link);
        this.router.navigate([page_link]);
    }
    change_page_with_data(page_link,data){
        this.router.navigate([page_link,data]);
    }
}