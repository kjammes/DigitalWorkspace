import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-provider-consumer-list',
  templateUrl: './provider-consumer-list.component.html',
  styleUrls: ['./provider-consumer-list.component.scss'],
})
export class ProviderConsumerListComponent implements OnInit {
  userObj: { name: string; about: string; skills: string[] } = {
    name: '',
    about: '',
    skills: [],
  };

  userObjArr = [];

  isProvider = this.storage.getParsedToken().provider;

  constructor(private storage: LocalStorageService, private api: ApiService) {}

  ngOnInit(): any {
    this.userObj.name = this.storage.getParsedToken().username;

    this.api.getAboutSkills().subscribe((res) => {
      this.userObj.about = res.about;
      if (res.skills.length > 3) {
        this.userObj.skills = res.skills.slice(0, 3);
        this.userObj.skills.push(
          '+' + (res.skills.length - 3) + 'more skills...'
        );
      } else this.userObj.skills = res.skills;
    });

    if( this.isProvider ){
      this.api.getConsumersList().subscribe((res:[])=>{
        this.userObjArr = res;
      });
    }
    else if( !this.isProvider ){
      this.api.getProvidersList().subscribe((res:[])=>{
        this.userObjArr = res;
      });
    }
    this.api.getProvidersList();

    this.isProvider = this.storage.getParsedToken().provider;

    this.api.switchToProviderEvent.subscribe((res) => (this.isProvider = res));
  }

  hideSkills(i:number) {
    if (i>3) return true;
  }
}