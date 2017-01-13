import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RedditModule } from './reddit/reddit.module';
import { LoginRoutingModule, loginRoutedComponents } from './login-routing.module';
import { AppRoutingModule } from './app-routing.module';
import { SubredditRoutingModule, subredditRoutedComponents } from './subreddit/subreddit-routing.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import { RedditService } from './reddit/reddit.service';
import { LoginComponent } from './login/login.component';
import { LoginCallbackComponent } from './login/login-callback.component';
import { LoginCompleteComponent } from './login/login-complete.component';



@NgModule({
  declarations: [
    AppComponent,
    loginRoutedComponents,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RedditModule,
    LoginRoutingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
