import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user/user.component';
import { RouterModule, Routes } from "@angular/router";
import { UserService } from "./user.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

const appRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
