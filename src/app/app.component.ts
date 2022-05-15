import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProjectFrontEnd';

  constructor(private authenticationService: AuthenticationService) { }

  logout(): void {
    this.authenticationService.logout();
    alert("Logged out successfully!");
  }
}

