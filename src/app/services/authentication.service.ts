import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from "../model/login";
import { Router } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient,
              private router: Router) { }

  login(username: string, password: string): Observable<HttpResponse<string>> {
    const ln: Login = { username, password };
    return this.http.post<string>('https://localhost:8443/login', ln, { observe: 'response' });
  }

  logout(): void {
    // remove items from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username')
    this.router.navigate(['/login']);
  }
}
