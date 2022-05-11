import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user/user.component';
import { RouterModule, Routes } from "@angular/router";
import { UserService } from "./user.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserDetailsComponent } from "./user/user-details/user-details.component";
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: ':id',
        component: UserDetailsComponent
      }
    ]
  },

  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserDetailsComponent,
    RegisterComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        ReactiveFormsModule
    ],
  providers: [UserService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
