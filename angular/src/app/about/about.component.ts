import { Component, OnInit } from '@angular/core';
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
  aboutObj = {
    about: '',
    skills: [],
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
    document.getElementById('f').style.display = 'none';
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
  onClickEditLink() {
    this.hideEditLinks = false;
    document.getElementById('f').style.display = 'flex';
  }

  onClickSaveChanges() {
    document.getElementById('f').style.display = 'none';
    this.hideEditLinks = true;
  }
}
