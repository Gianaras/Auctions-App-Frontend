import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor() { }

  canActivate(): boolean {
    // can only see users if we are logged in as an admin
    if (localStorage.getItem('token') && localStorage.getItem('isAdmin') === "true")
      return true;

    // not logged or not an admin, so throw an alert
    alert("Permission denied");
    return false;
  }
}
