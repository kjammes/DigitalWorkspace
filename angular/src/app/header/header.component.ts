import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  placeholder = 'freelancers';
  username: string = 'John';
  queryS: string = "";

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService,
    private router: Router,
    private api:ApiService,
    private eventService:EventEmitterService
  ) {}

  ngOnInit(): void {
    this.username = this.storage.getUserName();
    if (this.username.length > 4)
      this.username = this.username.slice(0, 4) + '...';
    if ( this.storage.getParsedToken().provider ) {
      this.placeholder = "jobs";
    }
  }

  logout() {
    this.authService.logout();
  }

  goToAbout() {
    this.router.navigate(['home-page/about']);
    this.eventService.hideNewPostButton.emit(false);
  }

  searchUserJob() {
    this.api.getSearchResults(this.queryS).subscribe( result => {
      this.eventService.searchResults.emit(result);
    } )
  }
}
