import { Component } from '@angular/core';
import { Router} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
 
})

export class AppComponent {
  constructor(private router: Router) {}

  showLoginHeader(){
    if (this.router.url.startsWith('/login')|| this.router.url=='/') {
      return true;
    } else {
      return false;
    }
  }
}
