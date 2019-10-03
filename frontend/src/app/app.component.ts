import { Component } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { AuthenticationService } from './services/authentication.service';
import { LoaderService } from "./shared/loader.subject";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
  loading: any = false;
  loadingSubscription: Subscription;
  constructor(private loaderService: LoaderService, private router: Router, private userIdle: UserIdleService, private authenticationService: AuthenticationService, ) {

  }
  ngOnInit() {
    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      //var url = this.router.url.split(";")[0];
      if (localStorage.currentUser) {
        this.authenticationService.logout();
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }
    });
    setTimeout(() => {
      this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value) => {
        this.loading = value;
      });
    }, 0);
  }
  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
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
    if (this.router.url.startsWith('/login') || this.router.url == '/' || this.router.url.startsWith('/candidate_login') || this.router.url.startsWith('/candidate_file_upload')) {
      return true;
    } else {
      return false;
    }
  }

}
