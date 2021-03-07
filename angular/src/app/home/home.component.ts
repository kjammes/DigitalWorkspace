import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from '../local-storage.service';
import { ShowEditTextService } from '../show-edit-text.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor( private eventService: ShowEditTextService,
    private router:Router,
    private storage:LocalStorageService ) { }

  hideButton = false;

  isProvider = this.storage.getParsedToken().provider;

  ngOnInit(): void {
    if( this.router.url != "/home-page/show-jobs" || this.storage.getParsedToken().provider ) {
      this.hideButton = true;
    }
    this.eventService.hideNewPostButton.subscribe( val => this.hideButton = val )
  }

  onCreateNewPost() {
    this.eventService.hideNewPostButton.emit(true);
  }
}
