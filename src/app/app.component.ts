import { Component } from '@angular/core';
import { RedditService } from './reddit/reddit.service';

var snoowrap = require('snoowrap');



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  constructor(
    private redditService: RedditService
  ) {}
  
  title = 'app works!';

  login() {
    var authenticationUrl = snoowrap.getAuthUrl({
      clientId: 'UR0TZ2uhKVVBeA',
      scope: ['identity', 'edit', 'flair', 'history', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'],
      redirectUri: 'http://localhost:4200/login/callback',
      permanent: true
    });

    window.location.href = authenticationUrl;
  }
}
