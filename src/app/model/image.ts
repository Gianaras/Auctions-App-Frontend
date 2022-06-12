import {Item} from "./item";

export class Image{
  image_data:string="";
  image_name:string = "";

  constructor(data:string,name:string) {
    this.image_data=data;
    this.image_name=name;
  }
}
