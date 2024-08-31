import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {UserService} from "../services/user.service";
import {User} from "../model/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted: boolean = false;
  returnUrl: string = '/';
  user: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  //  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get formControls() { return this.form.controls; }

  login(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;

    this.authenticationService.login(this.formControls['username'].value, this.formControls['password'].value)
      .subscribe(
        response => {
          localStorage.setItem('token', <string>response.headers.get('Authorization'));
          localStorage.setItem('isAdmin', <string>response.headers.get('IsAdmin')); // keep admin status for convenience
          localStorage.setItem('username', <string>response.headers.get('Username')); // keep username for convenience

          this.userService.getUserFromUsername(<string>response.headers.get('Username'))
            .subscribe(
              response => {
                  this.user = response;
                  localStorage.setItem('user', JSON.stringify(this.user)); // get rest of user
                },
              error => { alert(error); }
            );
          //alert("Logged in successfully!");
          this.router.navigate([this.returnUrl]);

          //scuffed way to ensure navigate finishes before we refresh and "overwrite" it
          setTimeout(() =>
            {
              window.location.reload()
            },
            100);


          this.loading = false;
        },
        error => {
          alert(error);
          this.loading = false;
        }
      );
  }
}
