import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chattingWith = 'Johny Summers';
  message = [
    'Message sdvsdiu siudnv sdvsd vsdjv sdkj vsdkjv sdkv ',
    'Message reply 1......................... ',
    'Message Reply2'
  ];

  constructor(
    private title: Title,
    private api:ApiService) {}

  ngOnInit(): void {
    this.title.setTitle('Messages - Digital Workspace');
  }

  onSubmit(form:NgForm) {
    this.api.sendMessage(form.value.message);
  } 
}
