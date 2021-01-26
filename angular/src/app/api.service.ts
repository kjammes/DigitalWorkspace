import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage:LocalStorageService,
    private router: Router
    ) {}

  login(formValue: { email: string; password: string }) {
    if(this.storage.getToken()) {
      this.router.navigate(['/']);
    }
    this.http
      .post('http://localhost:3000/login', formValue)
      .subscribe((response:{ token:string }) => {
        console.log(response.token);
        if( response.token ) {
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
    console.log(formValue);
    this.http
      .post('http://localhost:3000/register', formValue)
      .subscribe((response: { token: string }) => {
        console.log(response);
        if (response.token) {
          this.storage.setToken(response.token);
        }
        this.router.navigate(['/home-page/show-jobs']);
      });
  }

  add() {
    this.http
      .post(
        'http://localhost:3000/add',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTYxMTMxODExMn0.No7coqAtNRkX6vmnAGjpySIuA-Q9KoUSVfsk-xi1s1U`,
          }),
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
