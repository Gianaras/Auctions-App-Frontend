import {Component, OnInit} from "@angular/core";
import { MessageService } from "../../services/message.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import {Message} from "../../model/message";
import {User} from "../../model/user";

@Component({
  selector: 'app-messages',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit{

  messages: Message[]=[];
  form: FormGroup;
  disableDeleteButton:boolean=false;


  constructor (private service: MessageService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      itemSearch: ['']
    });
  }


  ngOnInit(): void {
    this.getMessages();
  }



  markAsRead(messages:Message[],myUser:User){
    //messages have been loaded into inbox, mark as read
    console.log(localStorage.getItem('token'));
    for(let message of messages){
      console.log(message.content);
      this.service.updateMessage(myUser.username,message).subscribe(
        (response: HttpResponse<any>) =>{
          console.log(response);
        },
        (error: HttpErrorResponse) => { alert(error.message);}
      );
    }
  }

  getMessages(){
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);
    this.service.getInbox(myUser.username).subscribe(
      (response: Message[]) => {
        this.messages = response;
      },
      (error: HttpErrorResponse) => { alert(error.message);},
      ()=> {this.markAsRead(this.messages,myUser)}
    );
  }

  deleteMessage(message: Message) {
    this.disableDeleteButton=true;
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);
    this.service.deleteMessage(message,myUser.username).subscribe(
      ()=> {
        console.log("Message deleted successfully")
      },
      (error:HttpErrorResponse) => {
        this.disableDeleteButton=false;
        alert(error.message);}
    );
    alert("Message deleted successfully");
    this.getMessages();
    this.disableDeleteButton=false;

  }
}

