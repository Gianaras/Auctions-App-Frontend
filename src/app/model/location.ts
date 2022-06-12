export class Location {
  id: number | undefined;
  country: string;
  longitude: string;
  latitude: string;
  location: string;

  constructor(country: string, longitude: string, latitude: string, location: string) {
    this.country = country;
    this.longitude = longitude;
    this.latitude = latitude;
    this.location = location;
  }
}
