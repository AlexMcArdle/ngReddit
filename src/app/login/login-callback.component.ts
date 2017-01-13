import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RedditService } from '../reddit/reddit.service';

import 'rxjs/add/operator/switchMap';

var snoowrap = require('snoowrap');

var snoo;

@Component({
  selector: 'login-callback',
  templateUrl: './login-callback.component.html'
})
export class LoginCallbackComponent implements OnInit {
  
  code: string;
  access_token: string;
  refresh_token: string;

  constructor(
    private redditService: RedditService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getToken(code: string): void {
    console.log(code);
    var somethingr = this.redditService.getTokenFromAuthCode(code);
  }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams['code'];
    this.access_token = this.route.snapshot.queryParams['access_token'];
    this.refresh_token = this.route.snapshot.queryParams['refresh_token'];
    
    if(this.code !== null) {
      this.getToken(this.code);
    }
  }

}
