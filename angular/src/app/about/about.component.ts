import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { GetLocationService } from '../get-location.service';
import { LocalStorageService } from '../local-storage.service';
import { ShowEditTextService } from '../show-edit-text.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  aboutObj: any = {
    _id:'',
    about: '',
    skills: [],
    links: [],
    posts: [],
  };
  username: string = null;

  geolocationPosition = null;
  lat = null;
  long = null;
  locationObject = {
    country: 'N/A',
    state: 'N/A',
    city: 'N/A',
  };

  myIddd = this.storage.getParsedToken()._id;

  isProvider: boolean = this.storage.getParsedToken().provider;

  constructor(
    private storage: LocalStorageService,
    private getLocation: GetLocationService,
    private showEditService: ShowEditTextService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let formElement = document.getElementById('f');
    if (formElement) formElement.style.display = 'none';
    this.username = this.storage.getUserName();

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      // console.log(queryParams);
      if (queryParams.user_id) {
        this.apiService.getAboutSkills(queryParams.user_id).subscribe((res) => {
          this.aboutObj = res;
          // console.log(res);
          this.isProvider = res.provider;
          this.username = res.username;
          if (res.forDisplay) {
            document.getElementById('provider-switch').style.display = 'none';
            let editTextButtons: any = document.getElementsByClassName(
              'svg-for-edit'
            );
            for (let curBut of editTextButtons) {
              curBut.style.display = 'none';
            }
            
            this.showEditService.hideAddNewLink.emit(true);
            console.log(res.forDisplay);
            
          }
        });
      } else {
        this.apiService.getAboutSkills().subscribe((res) => {
          this.aboutObj = res;
          this.username = this.storage.getUserName();
          this.isProvider = this.storage.getParsedToken().provider;
          console.log(res);

          document.getElementById('provider-switch').style.display = this
            .isProvider
            ? 'none'
            : 'flex';
          let editTextButtons: any = document.getElementsByClassName(
            'svg-for-edit'
          );
          for (let curBut of editTextButtons) {
            curBut.style.display = this.isProvider ? 'inline' : 'flex';
          }
          this.showEditService.hideAddNewLink.emit(false);
        });
      }
    });

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this.geolocationPosition = position;
          this.lat = this.geolocationPosition.coords.latitude;
          // console.log(this.lat, this.geolocationPosition.coords.latitude,"Lat");

          this.long = this.geolocationPosition.coords.longitude;
          // console.log(this.long, this.geolocationPosition.coords.longitude,"long");

          this.getLocation
            .getLocationObj(this.lat, this.long)
            .subscribe(
              (res: { country: string; state: string; city: string }) => {
                this.locationObject = res;
              }
            );
        },
        (error) => {
          switch (error.code) {
            case 1:
              this.geolocationPosition = 'Permission Denied';
              console.log(this.geolocationPosition);
              break;
            case 2:
              this.geolocationPosition = 'Position Unavailable';
              console.log(this.geolocationPosition);
              break;
            case 3:
              this.geolocationPosition = 'Timeout';
              console.log(this.geolocationPosition);
              break;
          }
        }
      );
    }

    this.showEditService.aboutUpdateSuccess.subscribe((text: string) => {
      this.aboutObj.about = text;
    });

    this.showEditService.skillsUpdateSuccess.subscribe(
      (skillsArr: string[]) => {
        this.aboutObj.skills = skillsArr;
      }
    );

    this.apiService.switchToProviderEvent.subscribe(
      (res) => (this.isProvider = res)
    );

    if (this.isProvider) {
      this.showEditService.hideNewPostButton.emit(true);
    }

    this.showEditService.newLinkCreated.subscribe((res) => {
      console.log(res);
      
      this.aboutObj.links.push(res);
    });
  }


  onClickEdit(action: string) {
    this.showEditService.editClicked.emit(action);
  }

  onSwitchToProvider() {
    let decision = confirm("Are you sure? It'll delete all your job posts!");
    if (decision) {
      this.apiService.switchToProvider();
      this.storage.removeToken();
      this.router.navigate(['/login']);
    }
  }

  hideEditLinks = true;
  onClickEditLink(linkObj) {
    this.hideEditLinks = false;
    let form = document.getElementById('f');
    if (form) form.style.display = 'flex';
    this.tempLinkObj = linkObj;
    // console.log(this.tempLinkObj);
    this.showCurrentlyEditingDiv = true;
  }

  tempLinkObj = {
    _id: "",
    socialMediaName: "",
    link: "",
  }
  showCurrentlyEditingDiv = false;
  onClickSaveChanges(formForVal:NgForm) {
    let form = document.getElementById('f');
    if (form) form.style.display = 'none';
    this.hideEditLinks = true;
    this.tempLinkObj.socialMediaName = formForVal.value.media_name;
    this.tempLinkObj.link = formForVal.value.media_link;
    // console.log(this.tempLinkObj);
    for (let linkObj of this.aboutObj.links) {
      if( linkObj._id === this.tempLinkObj._id ) {
        linkObj = this.tempLinkObj;
      }
    }
    this.apiService.updateSocialLink(this.tempLinkObj);
    this.showCurrentlyEditingDiv = false;
  }

  onClickDeleteLink(linkObj) {
    this.apiService.deleteSocialLink(linkObj);
    this.aboutObj.links = this.aboutObj.links.filter( data => data._id !== linkObj._id );
  }

  deletePost(id) {
    this.apiService.deletePost(id);
    this.aboutObj.posts = this.aboutObj.posts.filter( data => data._id !== id );
  }
}