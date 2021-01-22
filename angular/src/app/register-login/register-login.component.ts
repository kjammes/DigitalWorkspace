import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss'],
})
export class RegisterLoginComponent implements OnInit {
  mode = 'login';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if ( this.router.url === "/login" )
      this.mode = "login"
    else if( this.router.url === "/register" )
      this.mode = "register"
  }

  toggleMode() {
      this.mode === 'login'
        ? this.router.navigate(['/register'])
        : this.router.navigate(['/login']);
  }
}
