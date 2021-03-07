import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterLoginComponent } from './register-login/register-login.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProviderConsumerListComponent } from './provider-consumer-list/provider-consumer-list.component';
import { CreatePostComponent } from './create-post/create-post.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home-page/show-jobs',
    pathMatch: 'full',
  },
  {
    path: 'home-page',
    redirectTo: '/home-page/show-jobs',
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
    children: [
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthService],
        data: { loggedIn: true },
      },
      {
        path: 'show-freelancers',
        component: ProviderConsumerListComponent,
        canActivate: [AuthService],
        data: { loggedIn: true },
      },
      {
        path: 'show-jobs',
        component: ProviderConsumerListComponent,
        canActivate: [AuthService],
        data: { loggedIn: true },
      },
      {
        path: 'create-post',
        component: CreatePostComponent,
        canActivate: [AuthService],
        data: { loggedIn: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
