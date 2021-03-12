import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-provider-consumer-list',
  templateUrl: './provider-consumer-list.component.html',
  styleUrls: ['./provider-consumer-list.component.scss'],
})
export class ProviderConsumerListComponent implements OnInit {
  userObjArr = [];

  jobPosts: any;

  isProvider = this.storage.getParsedToken().provider;

  constructor(
    private storage: LocalStorageService,
    private api: ApiService,
    private eventService: EventEmitterService,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): any {
    if (this.isProvider) {
      this.title.setTitle('Job Lists - Digital Workspace'); 
      this.api.getPosts().subscribe((result) => {
        // console.log(result);
        if (result) {
          this.jobPosts = result;
        }
      });
      this.eventService.searchResults.subscribe((res) => (this.jobPosts = res));
    } else if (!this.isProvider) {
      this.title.setTitle('Freelancers List - Digital Workspace'); 
      this.api.getProvidersList().subscribe((res: []) => {
        // console.log(res);
        this.userObjArr = res;
      });
      this.eventService.searchResults.subscribe(
        (res) => (this.userObjArr = res)
      );
    }

    this.api.getProvidersList();

    this.isProvider = this.storage.getParsedToken().provider;

    this.api.switchToProviderEvent.subscribe((res) => (this.isProvider = res));
  }

  hideSkills(i: number) {
    if (i > 3) return true;
  }

  showAbout(obj: any) {
    console.log(obj);
    let id = obj.post_by || obj._id;
    console.log(id);
    this.router.navigate(['home-page/about'], {
      queryParams: {
        user_id: id,
      },
    });
  }

  jobDesc:string;
  jobBy:string;
  jobPostedDate: any;
  hideSideJobBar = true;
  showJobSideBar(jobObj: {
    _id: string,
    date: string,
    content: string,
    post_by: string,
    posted_by_name: string,
  }) {
    this.hideSideJobBar = false;
    this.jobBy = jobObj.posted_by_name;
    this.jobDesc = jobObj.content;
    this.jobPostedDate = jobObj.date;
  }
}