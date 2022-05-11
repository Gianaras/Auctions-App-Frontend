export class User {
  id: number | undefined;
  username: string = "";
  password: string = "";
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";
  country: string = "";
  city: string = "";
  admin: boolean = false;
  activated: boolean = false;

  constructor(username: string, password: string, firstName: string, lastName: string,
              email: string, phone: string, address: string, country: string, city: string) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.country = country;
    this.city = city;
    this.admin = false;
    this.activated = false;
  }
}
