import {Component, OnInit} from "@angular/core";
import { MessageService } from "../../services/message.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import {Message} from "../../model/message";
import {User} from "../../model/user";

@Component({
  selector: 'app-messages',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendMessageComponent implements OnInit{

  relevantUsers: User[]=[];
  form: FormGroup;

  constructor (private service: MessageService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      msg: ['']
    });
  }


  ngOnInit(): void {
      let userString: string | null = localStorage.getItem('user');
      if (!userString) return;
      let myUser: User = JSON.parse(userString);

    this.service.getRelevantUsers(myUser.username).subscribe(
      (response: User[]) => {
        this.relevantUsers = response;
      },
      (error: HttpErrorResponse) => { alert(error.message);} );
  }



  onSubmit(receiver:string): void {
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);
    let toSend: Message = new Message(this.form.value['msg'],myUser.username,receiver);
    console.log("Just sent "+this.form.value['msg'] + " to " + receiver);
    this.service.sendMessage(toSend).subscribe(
      () => {
        alert("Sucessfully sent message to user: "+ receiver);
      },
      error => {
        alert(error.message);
      }
    );
  }




}

