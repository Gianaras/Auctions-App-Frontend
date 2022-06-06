import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
          localStorage.setItem('isAdmin', <string>response.headers.get('IsAdmin'));
          localStorage.setItem('username', <string>response.headers.get('Username'));
          console.log(<string>response.headers.get('Authorization'));
          console.log(<string>response.headers.get('IsAdmin'));
          console.log(<string>response.headers.get('Username'));
          console.log(response);
          alert("Logged in successfully!");
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        error => {
          alert(error);
          this.loading = false;
        }
      );
  }
}
