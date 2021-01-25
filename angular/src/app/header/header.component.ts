import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  placeholder = 'freelancers';
  username:string = 'John' ;

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService) {}

  ngOnInit(): void {
    let parsedJWTToken = this.storage.getParsedToken();
    if( parsedJWTToken )
      this.username = parsedJWTToken.username;
    if( this.username.length > 4 )
      this.username = this.username.slice(0,4) + "... ";
  }

  logout() {
    this.authService.logout();
  }
}
