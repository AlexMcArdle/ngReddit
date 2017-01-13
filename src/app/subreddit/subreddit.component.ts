import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { SubredditRoutingModule } from './subreddit-routing.module';
import { RedditService } from '../reddit/reddit.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.css']
})

export class SubredditComponent implements OnInit {
  private selectedId: number;

  constructor(private redditService: RedditService, private route: ActivatedRoute) { }

  ngOnInit() {
  }
}
