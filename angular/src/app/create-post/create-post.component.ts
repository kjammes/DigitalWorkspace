import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ShowEditTextService } from '../show-edit-text.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  content:string = "";


  constructor( private api:ApiService,
    private eventS:ShowEditTextService,
    private router:Router ) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm) {
    let jobDescription = form.value.content;
    console.log("Content",jobDescription);
    if (jobDescription) {
      console.log("Inside the if condition");
      
      this.api.createPost(jobDescription);
      form.reset();
      
      this.eventS.hideNewPostButton.emit(false);
      this.router.navigate(['/home-page/show-jobs']);
    } 
  }
}
