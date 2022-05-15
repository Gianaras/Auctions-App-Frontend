import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../services/user.service";
import { User } from "../model/user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordMismatch: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private service: UserService) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  get formControls() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    this.passwordMismatch = (this.formControls['password'].value != this.formControls['repeatPassword'].value);
    if (this.form.invalid || this.passwordMismatch) return;
    this.loading = true;

    let user = new User(this.form.value['username'], this.form.value['password'], this.form.value['firstName'],
      this.form.value['lastName'], this.form.value['email'], this.form.value['phone'], this.form.value['address'],
      this.form.value['country'], this.form.value['city']);

    this.service.addUser(user).subscribe(
      () => {
        alert("Registration successful!");
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error => {
        alert(error.message);
        this.loading = false;
      }
    );
  }

}
