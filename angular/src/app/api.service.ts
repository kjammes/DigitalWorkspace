import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { EventEmitterService } from './event-emitter.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private router: Router,
    private editEventEmitter: EventEmitterService
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

  getAboutSkills(user_id?: string): Observable<any> {
    if (user_id) {
      return this.http.get(
        'http://localhost:3000/get-about-skills/' + user_id,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      );
    } else {
      return this.http.get('http://localhost:3000/get-about-skills/', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.storage.getToken()}`,
        }),
      });
    }
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
      .post(
        'http://localhost:3000/switch-to-provider',
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe((res: { message: string }) => {
        if (res.message === 'Succesfully switched to provider') {
          // console.log(res.message)
          this.switchToProviderEvent.emit(true);
        }
      });
  }

  getProvidersList(): Observable<any> {
    return this.http.get('http://localhost:3000/get-provider-list', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getToken()}`,
      }),
    });
  }

  getConsumersList(): Observable<any> {
    return this.http.get('http://localhost:3000/get-consumer-list', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getToken()}`,
      }),
    });
  }

  getUserNameById(id: string) {
    return this.http.post(
      'http://localhost:3000/get-name-by-id',
      {
        person_id: id,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.storage.getToken()}`,
        }),
      }
    );
  }

  createPost(content: string) {
    this.http
      .post(
        'http://localhost:3000/create-post',
        {
          content: content,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe((result) => {
        console.log(result);
      });
  }

  getPosts() {
    return this.http.get('http://localhost:3000/get-posts-list', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getToken()}`,
      }),
    });
  }

  getSearchResults(queryS: string) {
    return this.http.get(
      'http://localhost:3000/get-search-results?query=' + queryS,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.storage.getToken()}`,
        }),
      }
    );
  }

  addNewSocialLink(details: { name: string; link: string }) {
    console.log(details);

    this.http
      .post(
        'http://localhost:3000/add-new-social-link',
        {
          details,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe(
        (result: {
          message: string;
          newLink: {
            _id: string;
            socialMediaName: string;
            link: string;
          };
        }) => {
          console.log(result);
          this.editEventEmitter.newLinkCreated.emit(result.newLink);
        }
      );
  }

  updateSocialLink(details: {
    _id: string;
    socialMediaName: string;
    link: string;
  }) {
    this.http
      .post(
        'http://localhost:3000/update-social-link',
        {
          details,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.storage.getToken()}`,
          }),
        }
      )
      .subscribe((result: { message: string; updatedLink: Object }) => {
        console.log(result);
      });
  }

  deleteSocialLink(details: {
    _id: string;
    socialMediaName: string;
    link: string;
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storage.getToken()}`,
    });

    this.http
      .delete(`http://localhost:3000/remove-social-link/${details._id}`, {
        headers,
      })
      .subscribe((result) => console.log(result));
  }

  deletePost(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storage.getToken()}`,
    });

    this.http
      .delete(`http://localhost:3000/delete-post/${id}`, {
        headers,
      })
      .subscribe((result) => console.log(result));
  }
}