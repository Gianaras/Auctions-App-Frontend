export class Location {
  id: number;
  country: string;
  longitude: string;
  latitude: string;
  location: string;

  constructor(id: number, country: string, longitude: string, latitude: string, location: string) {
    this.id = id;
    this.country = country;
    this.longitude = longitude;
    this.latitude = latitude;
    this.location = location;
  }
}
