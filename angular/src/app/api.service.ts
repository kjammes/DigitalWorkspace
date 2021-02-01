import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { ShowEditTextService } from './show-edit-text.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private router: Router,
    private editEventEmitter: ShowEditTextService
  ) {}

  @Output() switchToProviderEvent: EventEmitter<boolean> = new EventEmitter();

  login(formValue: { email: string; password: string }) {
    if (this.storage.getToken()) {
      this.router.navigate(['/']);
    }
    this.http
      .post('http://localhost:3000/login', formValue)
      .subscribe((response: { token: string }) => {
        if (response.token) {
          this.storage.setToken(response.token);
        }
        this.router.navigate(['/home-page/show-jobs']);
      });
  }

  register(formValue: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (this.storage.getToken()) {
      this.router.navigate(['/']);
    }
    // console.log(formValue);
    this.http
      .post('http://localhost:3000/register', formValue)
      .subscribe((response: { token: string }) => {
        // console.log(response);
        if (response.token) {
          this.storage.setToken(response.token);
        }
        this.router.navigate(['/home-page/show-jobs']);
      });
  }

  sendMessage(message: string) {
    console.log(message);
    this.http
      .post(
        `http://localhost:3000/send-message/advesrverver23`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  getAboutSkills(): Observable<any> {
    let aboutObj = {
      about: '',
      skills: [],
    };
    return this.http
      .post(
        'http://localhost:3000/get-about-skills',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
  }

  updateUser(text: string, action: string) {
    this.http
      .post(
        `http://localhost:3000/update-about`,
        {
          text: text,
          section: action,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe((res: { message: string }) => {
        if (res.message === 'updated about') {
          this.editEventEmitter.aboutUpdateSuccess.emit(text);
        } else if (res.message === 'updated skills') {
          let skillsArr = text.split(',');
          this.editEventEmitter.skillsUpdateSuccess.emit(skillsArr);
        }
      });
  }

  switchToProvider() {
    this.http
      .post('http://localhost:3000/switch-to-provider',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          })
        }
      ).subscribe((res : { message: string })=>{
        if( res.message === 'Succesfully switched to provider' ) {
          // console.log(res.message)
          this.switchToProviderEvent.emit(true);
        }
      });
  }

  getProvidersList(): Observable<any> {
    return this.http
      .post(
        'http://localhost:3000/get-provider-list',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
  }

  getConsumersList(): Observable<any> {
    return this.http
      .post(
        'http://localhost:3000/get-consumer-list',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
  }

}