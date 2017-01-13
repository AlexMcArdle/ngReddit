import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';

import { LoginComponent } from './login/login.component';
//import { LoginCallbackComponent } from './login/login-callback.component';
import { PageNotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  
  { path: '', redirectTo: '/r/frontpage', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

export const routedComponents = [LoginComponent];