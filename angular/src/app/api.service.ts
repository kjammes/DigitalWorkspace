import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  login(formValue: { email: string; password: string }) {
    this.http
      .post('http://localhost:3000/login', formValue)
      .subscribe((response) => {
        console.log(response);
      });
  }

  register(formValue: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    console.log(formValue);
    this.http
      .post('http://localhost:3000/register', formValue)
      .subscribe((response) => {
        console.log(response);
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
