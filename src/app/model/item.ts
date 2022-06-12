import {Image} from "./image";

export class Item {
  id: number | undefined;
  name: string;
  description: string;
  itemsId: number | undefined;
  images: Image[] = [];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
