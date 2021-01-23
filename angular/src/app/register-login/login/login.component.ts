import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isInvalid: boolean;

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid || form.value.password.length < 8) {
      this.isInvalid = false;
      alert('Please Enter Valid Details and Fill In All The Fields');
      return;
    }
    this.apiService.login(form.value);
    form.reset();
  }
}
