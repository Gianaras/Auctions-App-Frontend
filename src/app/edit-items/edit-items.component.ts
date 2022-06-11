import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Item} from "../model/item";
import {Category} from "../model/category";
import {ItemsService} from "../services/items.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatDate} from "@angular/common";
import {User} from "../model/user";
import {Location} from "../model/location";
import {Items} from "../model/items";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-edit-items',
  templateUrl: './edit-items.component.html',
  styleUrls: ['./edit-items.component.css']
})
export class EditItemsComponent implements OnInit {

  form: FormGroup;
  itemForm: FormGroup;
  items: Item[] = [];
  initialAuction: Items | undefined;
  categories: Category[] = [new Category("food"), new Category("toys"), new Category("electronics"),
    new Category("books"), new Category("movies"), new Category("video games"), new Category("clothing"),
    new Category("footwear"), new Category("furniture"), new Category("music")];
  finalCategories: Category[] = [];
  submitted: boolean = false;
  itemSubmitted: boolean = false;
  addingItem: boolean = false;
  addingAuction: boolean = false;
  canEdit: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private itemsService: ItemsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.form = this.formBuilder.group({
      buyPrice: ['', Validators.min(0)],
      firstBid: ['', Validators.min(0)],
      endDate: [formatDate(0, 'shortDate', 'en')],
      country: [''],
      location: [''],
      longitude: [''],
      latitude: ['']
    });

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get formControls() { return this.form.controls; }
  get itemFormControls() { return this.itemForm.controls; }

  ngOnInit(): void {
    let itemsId: number = Number(this.router.url.split('/', 3)[2]); // get itemsId from url

    // get auction
    this.itemsService.getItems(itemsId).subscribe(
      (response: Items) => {
        this.initialAuction = response;

        // convert UTC times to typescript dates
        this.initialAuction.started = new Date();
        this.initialAuction.ends = new Date();
        this.initialAuction.started.setTime(this.initialAuction.startedUTC);
        this.initialAuction.ends.setTime(this.initialAuction.endsUTC);

        this.items = this.initialAuction.items;

        // check if this auction can be edited (it must have no bids and be active)
        let now: Date = new Date();
        let active: boolean = true;
        if ((now > this.initialAuction.ends) || (this.initialAuction.currentBid >= this.initialAuction.buyPrice))
          active = false;

        this.canEdit = !(!active || (this.initialAuction.bids && this.initialAuction.bids.length > 0));
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
  }

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
    this.items.push(new Item(this.itemForm.value['name'], this.itemForm.value['description']));
    form.resetForm();

    this.addingItem = false;
    this.itemSubmitted = false;
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

  // updates the auction
  onFinalSubmit(): void {
    if (!this.initialAuction) return;
    if (!this.canEdit) { alert("This auction has bids. It can no longer be updated."); return; }
    this.submitted = true;

    // get all the final values for the edited auction. For each field, check if it was changed during edit,
    // and if so, use the new value. Otherwise, use initial value (before edit)
    let finalBuyPrice: number = (this.form.value['buyPrice'] === "") ? this.initialAuction.buyPrice : this.form.value['buyPrice'];
    let finalFirstBid: number = (this.form.value['firstBid'] === "") ? this.initialAuction.firstBid : this.form.value['firstBid'];

    // if we didn't enter a date, convert to yyyy-mm-dd format for later
    let finalEndDate: string = this.form.value['endDate'];
    if (this.form.value['endDate'] === "1/1/70") { // default value of date if nothing is entered
      finalEndDate = this.initialAuction.ends.getFullYear().toString() + "-"
        + (this.initialAuction.ends.getMonth() + 1).toString() + "-"
        + this.initialAuction.ends.getDate().toString();
    }
    let finalCountry: string = (this.form.value['country'] === "") ? this.initialAuction.location.country : this.form.value['country'];
    let finalLocation: string = (this.form.value['location'] === "") ? this.initialAuction.location.location : this.form.value['location'];
    let finalLongitude: string = (this.form.value['longitude'] === "") ? this.initialAuction.location.longitude : this.form.value['longitude'];
    let finalLatitude: string = (this.form.value['latitude'] === "") ? this.initialAuction.location.latitude : this.form.value['latitude'];

    // check if forms are correct
    let invalid: boolean = false;
    if (this.form.invalid) return;
    if (finalBuyPrice <= finalFirstBid) invalid = true; // first bid < buy price
    if (this.items.length == 0) invalid = true; // at least one item is needed

    if (isNaN(Number(finalLongitude)) || isNaN(Number(finalLatitude))) invalid = true;
    if (Number(finalLongitude) < -180 || Number(finalLongitude) > 180
      || Number(finalLatitude) < -180 || Number(finalLatitude) > 180) invalid = true; // range: [-180, 180]

    // convert times to UTC
    let tokens: string[] = finalEndDate.split("-", 3);
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
    let location: Location = new Location(finalCountry, finalLongitude,
      finalLatitude, finalLocation, myUser);

    // remove ids from item list (they mess up the request)
    for (let item of this.items) item.id = undefined;

    // create auction
    let items: Items = new Items(0, finalBuyPrice, finalFirstBid,
      0, (new Date()).getTime(), date.getTime(), myUser.seller, location, this.finalCategories,
      this.items);
    console.log(items);

    let itemsId: number = Number(this.router.url.split('/', 3)[2]); // get itemsId from url
    this.itemsService.updateItems(items, itemsId).subscribe(
      () => {
        alert("Auction updated successfully!");
        this.router.navigate(['../..'], { relativeTo: this.route });
      },
      error => {
        alert(error.message);
        this.addingAuction = false;
      }
    );
  }

}
