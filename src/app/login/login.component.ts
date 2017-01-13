import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RedditService } from '../reddit/reddit.service';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private redditService: RedditService,
    private activatedRoute: ActivatedRoute
  ) { }

  login(): void {
    this.redditService.login();
  }

  ngOnInit() {
    this.login();
  }

}
