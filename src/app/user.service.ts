import { Injectable } from '@angular/core';
import { User } from "./model/user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl ='http://localhost:8080/users';

  constructor (private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.usersUrl+"/"+userId);
  }
}
