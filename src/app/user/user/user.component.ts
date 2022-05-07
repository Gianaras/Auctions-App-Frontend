import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user.service";
import { User } from "../../model/user";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];

  constructor (private service: UserService) { }

  ngOnInit(): void {
    this.service.getUsers().subscribe(users => this.users = users)
  }

}
