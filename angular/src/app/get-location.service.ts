import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GetLocationService {
  constructor(private http: HttpClient, private storage: LocalStorageService) {}

   getLocationObj(lat,long): Observable<any> {
    //
    let latitude = lat || 19.075983;
    let longitude = long || 72.877655;
    //

    return this.http
      .post(
        'http://localhost:3000/get-location',
        {
          latitude: latitude,
          longitude: longitude,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      );
  }
}
