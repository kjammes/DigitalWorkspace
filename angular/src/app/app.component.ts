import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from './event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private editTextService: EventEmitterService
  ) {}
  isHidden = true;

  ngOnInit() {
    this.editTextService.editClicked.subscribe((action:string)=>{
      this.isHidden = false;
    });

    this.editTextService.saveClicked.subscribe((val)=>{
      this.isHidden = true;
    })

    this.editTextService.hideEditComponent.subscribe( hide => this.isHidden = hide )
  }
  
}
