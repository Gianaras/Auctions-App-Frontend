import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {

  constructor() { }

  canActivate(): boolean {
    // only logged-in users can access
    if (localStorage.getItem('token'))
      return true;

    // not logged in, so throw an alert
    alert("Permission denied (You need to be logged-in)");
    return false;
  }
}
