import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  placeholder = 'freelancers';
  username: string = 'John';

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.storage.getUserName();
    if (this.username.length > 4)
      this.username = this.username.slice(0, 4) + '...';
  }

  logout() {
    this.authService.logout();
  }

  goToAbout() {
    this.router.navigate(['home-page/about']);
  }
  
  goToMessageSection() {
    this.router.navigate(['home-page/chat']);
  }
}
