import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isInvalid:boolean;

  constructor(
    private apiService:ApiService,
    private title: Title) {}
  
  ngOnInit(): void {
    this.title.setTitle('Register - Digital Workspace');
  }

  onSubmit(form: NgForm) {
    if( 
      !form.valid || 
      form.value.password !== form.value.confirmPassword ||
      form.value.password.length <8 ) {
      this.isInvalid = false;
      alert('Please Enter Valid Details and Fill In All The Fields');
      return;
    }
    this.apiService.register(form.value);
    form.reset();
  }
}
