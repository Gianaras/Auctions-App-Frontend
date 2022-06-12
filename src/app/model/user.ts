import {Seller} from "./seller";
import {Location} from "./location";

export class User {
  id: number | undefined;
  username: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  admin: boolean = false;
  activated: boolean = false;
  seller: Seller;
  location: Location;

  constructor(username: string, password: string, firstName: string, lastName: string,
              email: string, phone: string, seller: Seller, location: Location) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.admin = false;
    this.activated = false;
    this.seller = seller;
    this.location = location;
  }
}
