import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { RedditService } from '../../reddit/reddit.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';

import { PostComponent } from './post.component';

const snoowrap = require('snoowrap');

export class Subreddit {
  constructor(private title: string) {}
}

export class Post {
  constructor(private title: string, private id: string, private subreddit: Subreddit) { }
}

@Component({
  selector: 'subreddit-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent implements OnInit {

  subreddit: string;
  posts: Observable<any[]>;
  private selectedId: number;
  

  constructor(private redditService: RedditService, private route: ActivatedRoute) {
    
  }

  isSelected(post: Post) {

  }

  onSelect(post: Post) {

  }

  ngOnInit() {
    var r = new snoowrap({
      userAgent: 'web:ngReddit:v0.0.1 (by /u/fefejones)',
      clientId: 'OsanjvZjHR6egQ',
      clientSecret: 'SWedAjaSOBdMrGwRpMf4e9DB0vQ',
      username: 'fefejones',
      password: 'meowmix'
    });

    this.posts = r.getHot().then(posts => {
        console.log(posts);
        return posts;
    });
  }
}

