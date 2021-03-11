import { EventEmitter, Injectable, Output } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ShowEditTextService {

  constructor() { }

  @Output() editClicked: EventEmitter<string> = new EventEmitter();
  @Output() saveClicked: EventEmitter<string> = new EventEmitter();
  @Output() aboutUpdateSuccess: EventEmitter<string> = new EventEmitter();
  @Output() skillsUpdateSuccess: EventEmitter<string[]> = new EventEmitter();
  @Output() hideNewPostButton: EventEmitter<boolean> = new EventEmitter();
  @Output() searchResults: EventEmitter<any> = new EventEmitter();
  @Output() newLinkCreated: EventEmitter<any> = new EventEmitter();
  @Output() hideAddNewLink: EventEmitter<boolean> = new EventEmitter();
  
}