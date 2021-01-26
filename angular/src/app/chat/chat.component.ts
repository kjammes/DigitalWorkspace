import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {}

  onSubmit(form:NgForm) {
    
  }
}
