import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';


var snoowrap = require('snoowrap');

@Injectable()
export class RedditService {

  loggedIn: boolean

  constructor(private router: Router) {
    this.loggedIn = false;
   }

  // Returns true if get token from auth worked
  getTokenFromAuthCode(code: string) {
    snoowrap.fromAuthCode({
      code: code,
      userAgent: 'web:ngReddit:v0.0.1 (by /u/fefejones)',
      clientId: '8LYFP3khVRwCUQ',
      redirectUri: 'http://localhost:4200/login/callback'
    }).then(r => {
      // Now we have a requester that can access reddit through the user's account
      this.loggedIn = true;
      this.router.navigate(['/r/frontpage', { }])
    })
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getFrontpage() {
    return snoowrap.getHot().then(posts => {
      return posts;
    })
  }

  login(): void {
    var authenticationUrl = snoowrap.getAuthUrl({
      clientId: '8LYFP3khVRwCUQ',
      scope: ['identity', 'edit', 'flair', 'history', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'],
      redirectUri: 'http://localhost:4200/login/callback',
      permanent: true
    });
  
    window.location.href = authenticationUrl;
  }
}