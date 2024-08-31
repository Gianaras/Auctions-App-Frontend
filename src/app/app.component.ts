import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {MessageService} from "./services/message.service";
import {User} from "./model/user";
import {interval} from "rxjs";
import {Message} from "./model/message";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Όρμος Έψιλον';

  messages:Message[]=[];
  unreadCount = 0;
  user:User|null = null;

  constructor(private authenticationService: AuthenticationService,
  private service: MessageService) {
  }

  logout(): void {
    this.authenticationService.logout();
    this.user = null;
    //alert("Logged out successfully!");
  }

  ngOnInit() {
    this.loadUser();
  }

  loadUser(){
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    this.user = JSON.parse(userString);
    this.getMessages();
  }

  getMessages(){
    this.messages = [];
    //5 second interval between http requests to inbox
    interval(5000).subscribe(
      x=>{
        let userString: string | null = localStorage.getItem('user');
        if (!userString) return;
        let myUser: User = JSON.parse(userString);
        this.service.getInbox(myUser.username).subscribe(
        (response: Message[]) => {


          this.messages = response;
          this.unreadCount =0;
          for(let message of this.messages){
            if(message.isRead==false){
                this.unreadCount++;
            }
          }
         // console.log("You have "+this.unreadCount+" messages!");


        },
        (error: HttpErrorResponse) => { console.log(error.message);} )
  });
  }



}

