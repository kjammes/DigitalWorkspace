import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isInvalid:boolean;

  constructor() {}
  
  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log(form.valid)
    if (!form.valid || form.value.password.length < 8) {
      this.isInvalid = false;
      console.log('isInvalid', this.isInvalid);
      alert('Please Enter Valid Details and Fill In All The Fields');
      return;
    }
    form.reset();
  }

}
