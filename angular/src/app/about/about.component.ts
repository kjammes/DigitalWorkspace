import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    about: "",
    skills: []
  }
  username: string = null;

  geolocationPosition = null;
  lat = null;
  long = null;
  locationObject = {
    country: 'N/A',
    state: 'N/A',
    city: 'N/A',
  };

  isProvider:boolean = this.storage.getParsedToken().provider;

  constructor(
    private storage: LocalStorageService,
    private getLocation: GetLocationService,
    private showEditService: ShowEditTextService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.storage.getUserName();

    this.apiService.getAboutSkills().subscribe((res)=> {
      this.aboutObj = res;
    });

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          (this.geolocationPosition = position);
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

    this.showEditService.aboutUpdateSuccess.subscribe( (text:string) => {
      this.aboutObj.about = text;
    } );

    this.showEditService.skillsUpdateSuccess.subscribe( (skillsArr:string[]) => {
      this.aboutObj.skills = skillsArr;
    } );

    this.apiService.switchToProviderEvent.subscribe(res=> this.isProvider = res);
  }

  onClickEdit(action:string) {
    this.showEditService.editClicked.emit(action);
  }

  onSwitchToProvider() {
    this.apiService.switchToProvider();
    this.storage.removeToken();
    this.router.navigate(['/login']);
  }
}
