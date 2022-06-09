import {Component, OnInit} from "@angular/core";
import { MessageService } from "../../services/message.service";
import { HttpErrorResponse } from "@angular/common/http";
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

  constructor (private service: MessageService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      itemSearch: ['']
    });
  }


  ngOnInit(): void {
      let userString: string | null = localStorage.getItem('user');
      if (!userString) return;
      let myUser: User = JSON.parse(userString);

    this.service.getInbox(myUser.username).subscribe(
      (response: Message[]) => {
        this.messages = response;
        console.log("Response: "+this.messages);
      },
      (error: HttpErrorResponse) => { alert(error.message);} );
  }

}

