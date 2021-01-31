import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShowEditTextService } from './show-edit-text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private editTextService: ShowEditTextService
  ) {}
  isHidden = true;

  ngOnInit() {
    this.editTextService.editClicked.subscribe((action:string)=>{
      this.isHidden = false;
    });

    this.editTextService.saveClicked.subscribe((val)=>{
      this.isHidden = true;
    })
  }
  
}
