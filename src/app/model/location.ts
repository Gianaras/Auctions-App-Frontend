import {User} from "./user";

export class Location {
  id: number | undefined;
  country: string;
  longitude: string;
  latitude: string;
  location: string;
  user: User;

  constructor(country: string, longitude: string, latitude: string, location: string, user: User) {
    this.country = country;
    this.longitude = longitude;
    this.latitude = latitude;
    this.location = location;
    this.user = user;
  }
}
