import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user.service";
import { User } from "../../model/user";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];

  constructor (private service: UserService) { }

  ngOnInit() {
    this.service.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

}
