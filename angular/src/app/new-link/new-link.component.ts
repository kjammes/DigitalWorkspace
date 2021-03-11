import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { ShowEditTextService } from '../show-edit-text.service';

@Component({
  selector: 'app-new-link',
  templateUrl: './new-link.component.html',
  styleUrls: ['./new-link.component.scss']
})
export class NewLinkComponent implements OnInit {

  hideForm = true;

  constructor(private api:ApiService,
    private events:ShowEditTextService) { }

  ngOnInit(): void {
    this.events.hideAddNewLink.subscribe( val => {
      if(val) {
        document.getElementById('add-social').style.display = 'none';
      } else {
        document.getElementById('add-social').style.display = 'block';
      }
    } )
  }

  onSubmit(form:NgForm) {
    this.hideForm = true;
    const linkObj = form.value;
    console.log(linkObj);
    this.api.addNewSocialLink(linkObj);
  }
}
