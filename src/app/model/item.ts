export class Item {
  id: number | undefined;
  name: string;
  description: string;
  itemsId: number | undefined;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
