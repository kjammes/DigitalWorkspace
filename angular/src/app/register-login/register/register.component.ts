import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isInvalid:boolean;

  constructor(private apiService:ApiService) {}
  
  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log("form.valid is ",form.valid)
    if( 
      !form.valid || 
      form.value.password !== form.value.confirmPassword ||
      form.value.password.length <8 ) {
      this.isInvalid = false;
      console.log("isInvalid is ",this.isInvalid)
      alert('Please Enter Valid Details and Fill In All The Fields');
      return;
    }
    this.apiService.register(form.value);
    form.reset();
  }
}
