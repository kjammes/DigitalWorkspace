import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  username: string = null;
  skillsList: string[] = [
    'Cyber Security',
    'Database Administration',
    'Web Development',
    'App Development',
    'Machine Learning',
    'Blockchain',
  ];
  aboutUser = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tristique metus sit amet eros ultrices sodales. Suspendisse venenatis mi sit amet commodo venenatis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur id libero non lorem eleifend efficitur ac id odio. Fusce vestibulum ligula ut malesuada tincidunt. Praesent a ante ut diam posuere luctus non quis diam. Nulla viverra turpis felis, eu mattis nisl ornare a. Mauris vehicula auctor leo sit amet finibus. Maecenas laoreet massa at erat luctus, a dignissim dui aliquet. Proin viverra nibh nec mollis facilisis. Aenean ac neque maximus, ullamcorper magna ut, consequat purus. Phasellus ornare risus et mi hendrerit finibus. Proin blandit sapien sed nibh tristique ullamcorper ac vel ante. Vivamus laoreet, mauris sed ornare bibendum, libero felis condimentum nulla, quis porta nulla quam at tellus. In ac ullamcorper turpis.`;
  geolocationPosition = null;
  lat = null;
  long = null;
  state = "N/A";
  country = "N/A";
  city = "N/A";

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.username = this.storage.getUserName();

    //getting user coordinates\
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          (this.geolocationPosition = position), console.log(position);
          this.lat = this.geolocationPosition.coords.latitude;
          this.long = this.geolocationPosition.coords.longitude;
          console.log(this.lat,this.long);
          console.log(this.fetchLocationName(this.lat,this.long));
          
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
  } //end of getting user coordinates

  fetchLocationName = async (lat, lng) => {
    await fetch(
      'https://www.mapquestapi.com/geocoding/v1/reverse?key=ZnbkZcbWDs9sByGfAed75y4H75QLxxQX&location=' +
        lat +
        '%2C' +
        lng +
        '&outFormat=json&thumbMaps=false'
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          responseJson
        );
        this.country = responseJson.results[0].locations[0].adminArea1;
        this.city = responseJson.results[0].locations[0].adminArea5;
        this.state = responseJson.results[0].locations[0].adminArea3;
      })
      .catch((err)=> {
        console.log(err);
      });
  };
}
