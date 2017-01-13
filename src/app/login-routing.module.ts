import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LoginCallbackComponent } from './login/login-callback.component';
import { LoginCompleteComponent } from './login/login-complete.component';

/*const loginRoutes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    children: [
      { path: 'callback', component: LoginCallbackComponent },
      { path: 'complete', component: LoginCompleteComponent }
    ]
  },
];*/

const loginRoutes: Routes = [
  { path: 'login/callback', component: LoginCallbackComponent },
  { path: 'login/complete', component: LoginCompleteComponent },
  { path: 'login', component: LoginComponent }
]

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule],
})
export class LoginRoutingModule { }

export const loginRoutedComponents = [LoginComponent, LoginCallbackComponent, LoginCompleteComponent];