import {Component, OnInit} from "@angular/core";
import { MessageService } from "../../services/message.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import {Message} from "../../model/message";
import {User} from "../../model/user";

@Component({
  selector: 'app-messages',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent implements OnInit{

  messages: Message[]=[];
  form: FormGroup;

  disableDeleteButton:Boolean = false;

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

  getMessages(){
    this.messages = [];
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);
    this.service.getOutbox(myUser.username).subscribe(
      (response: Message[]) => {
        this.messages = response;
      },
      (error: HttpErrorResponse) => { alert(error.message);}
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

