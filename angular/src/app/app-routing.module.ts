import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterLoginComponent } from './register-login/register-login.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home-page',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterLoginComponent,
    canActivate: [AuthService],
  },
  {
    path: 'login',
    component: RegisterLoginComponent,
    canActivate: [AuthService],
  },
  {
    path: 'home-page',
    component: HomeComponent,
    canActivate: [AuthService],
    data: { loggedIn: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
