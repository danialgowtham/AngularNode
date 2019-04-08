import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { AuthenticationService } from './services/authentication.service';
import { LoaderService } from "./shared/loader.subject"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
  loader: Boolean;
  constructor(private loader_subject: LoaderService, private router: Router, private userIdle: UserIdleService, private authenticationService: AuthenticationService, ) { }
  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.authenticationService.logout();
      this.router.navigate(['/']);
    });
    this.loader_subject.getLoader().subscribe(loader => { this.loader = loader });
  }
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
  showLoginHeader() {
    if (this.router.url.startsWith('/login') || this.router.url == '/') {
      return true;
    } else {
      return false;
    }
  }
}
