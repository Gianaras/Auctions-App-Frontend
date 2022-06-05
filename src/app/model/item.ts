export class Item {
  id: number;
  name: string;
  description: string;
  itemsId: number;

  constructor(id: number, name: string, description: string, itemsId: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.itemsId = itemsId;
  }
}
