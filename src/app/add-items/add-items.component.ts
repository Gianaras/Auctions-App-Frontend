import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import { formatDate } from "@angular/common";
import { Item } from "../model/item";
import {Items} from "../model/items";
import {User} from "../model/user";
import {Location} from "../model/location";
import {Category} from "../model/category";
import {ItemsService} from "../services/items.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Image} from "../model/image";

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})
export class AddItemsComponent implements OnInit {

  form: FormGroup;
  itemForm: FormGroup;
  items: Item[] = [];
  categories: Category[] = [new Category("food"), new Category("toys"), new Category("electronics"),
    new Category("books"), new Category("movies"), new Category("video games"), new Category("clothing"),
    new Category("footwear"), new Category("furniture"), new Category("music")];
  finalCategories: Category[] = [];
  submitted: boolean = false;
  itemSubmitted: boolean = false;
  addingItem: boolean = false;
  addingAuction: boolean = false;

  file: File | any = null;
  newItem: Item | any = null;
  itemImages: string[] = [];
  imageNames:string[]=[];

  constructor(private formBuilder: FormBuilder,
              private itemsService: ItemsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      buyPrice: ['', Validators.required, Validators.min(0)],
      firstBid: ['', Validators.required, Validators.min(0)],
      endDate: [formatDate(0, 'shortDate', 'en'), Validators.required],
      country: ['', Validators.required],
      location: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required]
    });

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get formControls() { return this.form.controls; }
  get itemFormControls() { return this.itemForm.controls; }

  ngOnInit(): void {}

  // triggers when we click on a checkbox for categories
  onCheckbox(categoryName: string, event: any): void {
    if (event.target.checked) this.finalCategories.push(new Category(categoryName));
    else {
      let index: number = this.finalCategories.indexOf(new Category(categoryName));
      this.finalCategories.splice(index, 1);
    }
  }

  // triggers when we add an item to the auction
  onItemSubmit(form: FormGroupDirective): void {
    this.itemSubmitted = true;
    if (this.itemForm.invalid) return;

    this.addingItem = true;
    this.newItem = new Item(this.itemForm.value['name'], this.itemForm.value['description']);

    for(let i=0 ; i < this.itemImages.length ;i++){
      this.newItem.images.push(new Image(this.itemImages[i],this.imageNames[i]));
    }
    this.items.push(this.newItem);
    form.resetForm();

    this.addingItem = false;
    this.itemSubmitted = false;
    this.itemImages=[];
    this.imageNames=[];
  }

  // removes item from the auction
  removeItem(name: string, description: string): void {
    for (let i=0; i<this.items.length; i++) {
      if (this.items[i].name == name && this.items[i].description == description) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  // creates the auction
  onFinalSubmit(): void {
    this.submitted = true;

    // check if forms are correct
    let invalid: boolean = false;
    if (this.form.invalid) return;
    if (this.form.value['buyPrice'] <= this.form.value['firstBid']) invalid = true; // first bid < buy price
    if (this.items.length == 0) invalid = true; // at least one item is needed

    if (isNaN(Number(this.form.value['longitude'])) || isNaN(Number(this.form.value['latitude']))) invalid = true;
    if (this.form.value['longitude'] < -180 || this.form.value['longitude'] > 180
     || this.form.value['latitude'] < -180 || this.form.value['latitude'] > 180) invalid = true; // range: [-180, 180]

    // convert times to UTC
    let tokens: string[] = this.form.value['endDate'].split("-", 3);
    let date: Date = new Date();
    date.setFullYear(+tokens[0], +tokens[1]-1, +tokens[2]);
    if (date.getTime() < (new Date()).getTime()) invalid = true; // end date must be further than the now

    if (invalid) {
      alert("Your input is invalid. Check that longitude, latitude and dates are correct. First bid must be" +
        "lower than buy price. At least one item is needed.");
      return;
    }

    this.addingAuction = true;

    // get logged-in user
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);

    // get location
    let location: Location = new Location(this.form.value['country'], this.form.value['longitude'],
      this.form.value['latitude'], this.form.value['location']);

    // add auction
    let items: Items = new Items(0, this.form.value['buyPrice'], this.form.value['firstBid'],
      0, (new Date()).getTime(), date.getTime(), myUser.seller, location, this.finalCategories,
      this.items);

    this.itemsService.addItems(items).subscribe(
      () => {
        alert("Auction created successfully!");
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error => {
        alert(error.message);
        this.addingAuction = false;
      }
    );
  }

  onChange(event:any) {
    this.file=event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    const file = this.file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageNames.push(file.name);
      this.itemImages.push(reader.result as string);
      console.log(reader.result);
    };
    alert("Image successfully uploaded");
  }

}
