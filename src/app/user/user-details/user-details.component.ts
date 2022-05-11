import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { UserService } from "../../user.service";
import { User } from "../../model/user";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: User | undefined;
  isDeleting = false;

  constructor(private route: ActivatedRoute,
              private service: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    let idStr = this.route.snapshot.paramMap.get('id');

    if (idStr == null) {
      console.log("null id in getUser of UserDetailsComponent");
      return;
    }
    let id = +idStr;

    this.service.getUser(+id).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

  deleteUser(userId: number): void {
    this.isDeleting = true;
    this.service.deleteUser(userId).subscribe(
      () => {
        alert("Deletion successful!");
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error => {
        alert(error.message);
        this.isDeleting = false;
      }
    );
  }

}
