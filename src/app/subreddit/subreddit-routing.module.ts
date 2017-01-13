import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubredditComponent } from './subreddit.component';
import { PostsComponent } from './posts/posts.component';

const subredditRoutes: Routes = [
  { path: 'r/:subreddit', component: SubredditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(subredditRoutes)],
  exports: [RouterModule],
})
export class SubredditRoutingModule {

  constructor() {}

 }

export const subredditRoutedComponents = [SubredditComponent, PostsComponent];