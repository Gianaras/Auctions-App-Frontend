import { Injectable } from '@angular/core';
import { User } from "../model/user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {Message} from "../model/message";

const httpOptions = {
  headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MessageService{

  private messagesURL ='https://localhost:8443/messages';

  constructor (private http: HttpClient) { }

  sendMessage(message: Message): Observable<any> {
    return this.http.post(this.messagesURL+"/send/"+message.sender+"/"+message.receiver,message);
  }

  getInbox(username: string){
    return this.http.get<Message[]>(this.messagesURL+"/inbox/"+username);
  }

  getRelevantUsers(username: string){
    return this.http.get<User[]>(this.messagesURL+"/send/"+username);
  }


}
