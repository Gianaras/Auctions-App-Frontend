import { Injectable } from '@angular/core';
import { User } from "../model/user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl ='https://localhost:8443/users';
  private getUserUrl ='https://localhost:8443/getUserFromUsername';

  constructor (private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.usersUrl+"/"+userId);
  }

  getUserFromUsername(username: string): Observable<User> {
    return this.http.get<User>(this.getUserUrl + "/" + username);
  }

  addUser(user: User): Observable<any> {
    return this.http.post(this.usersUrl+"/register", user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(this.usersUrl+"/"+userId);
  }

  activateUser(user: User): Observable<any> {
    user.activated = true;
    return this.http.put(this.usersUrl+"/"+user.id, user);
  }

}
