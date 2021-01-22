import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLoginComponent } from './register-login/register-login.component';

const routes: Routes = [
  { path: 'register' , component: RegisterLoginComponent },
  { path: 'login' , component: RegisterLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
