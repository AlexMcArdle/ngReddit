import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RedditService } from '../reddit/reddit.service';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'login-complete',
  templateUrl: './login-complete.component.html'
})
export class LoginCompleteComponent implements OnInit {
  
  constructor(
    private redditService: RedditService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log("login complete");
  }
}
