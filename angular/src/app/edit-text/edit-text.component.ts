import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShowEditTextService } from '../show-edit-text.service';

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
  styleUrls: ['./edit-text.component.scss'],
})
export class EditTextComponent implements OnInit {
  constructor(
    private showEditService: ShowEditTextService,
    private apiService: ApiService) {}

  action:string = "about";
  text:string = "";
  
  ngOnInit(): void {
    this.showEditService.editClicked.subscribe((action: string) => {
      this.action = action;
    });
  }


  onSave() {
    this.showEditService.saveClicked.emit(this.text);
    this.apiService.updateUser(this.text,this.action);
  }
}