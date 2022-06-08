import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user/user.component';
import { RouterModule, Routes } from "@angular/router";
import { UserService } from "./services/user.service";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserDetailsComponent } from "./user/user-details/user-details.component";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./guards/auth.guard";
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ItemsComponent } from "./items/items.component";
import { ItemDetailsComponent } from "./item-details/item-details.component";
import { ItemsService } from "./services/items.service";
import { AddItemsComponent } from "./add-items/add-items.component";
import { LoginGuard } from "./guards/login.guard";

const appRoutes: Routes = [
  { path: 'users', canActivate: [AuthGuard], children: [
      { path: '', component: UserComponent },
      { path: ':id', component: UserDetailsComponent}
    ]
  },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'items', children: [
      { path: '', component: ItemsComponent },
      { path: ':id', component: ItemDetailsComponent }
    ]
  },

  { path: 'myItems', children: [
      { path: '', canActivate: [LoginGuard], component: ItemsComponent },
      { path: 'add', component: AddItemsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent, UserComponent, UserDetailsComponent, RegisterComponent,
    LoginComponent, ItemsComponent, ItemDetailsComponent, AddItemsComponent,
  ],
    imports: [
        BrowserModule, FormsModule, HttpClientModule,
        RouterModule.forRoot(appRoutes), ReactiveFormsModule
    ],
  providers: [
    UserService, ItemsService,
    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
