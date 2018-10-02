import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { HOME_URL, TOKEN_URL } from './../../../../config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

@Injectable()
export class AccessService {

  constructor(
    private http: HttpClient
  ) {}

  getToken(user: User): Promise<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', user.username);
    body.set('password', user.password);
    body.set('scope', 'offline_access openid profile');
    body.set('resource', 'api://enterprise');

    return new Promise((resolve, reject) => {
      this.http.post(TOKEN_URL, body.toString(), httpOptions)
        .subscribe((data) => resolve(data), err => reject(err));
    });
  }

  login(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getToken(user)
        .then((data) => {
          this.http.get(HOME_URL, { headers: new HttpHeaders({
            'Authorization': `Bearer ${data.access_token}`
          })})
            .subscribe(
              res => resolve(true),
              error => console.log(error)
            );
        })
        .catch(err => reject(err));
    });
  }
}
