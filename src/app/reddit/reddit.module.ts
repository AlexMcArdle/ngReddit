import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SubredditRoutingModule, subredditRoutedComponents } from '../subreddit/subreddit-routing.module';
import { RedditService } from './reddit.service';

import { LoginComponent } from '../login/login.component';
import { LoginCallbackComponent } from '../login/login-callback.component';
import { LoginCompleteComponent } from '../login/login-complete.component';

import { PostComponent } from '../subreddit/posts/post.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SubredditRoutingModule
  ],
  declarations: [
    subredditRoutedComponents,
    PostComponent
  ],
  providers: [
    RedditService
  ]
})
export class RedditModule { }
