import { Component, OnInit } from '@angular/core';
import { Items } from "../model/items";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemsService } from "../services/items.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Item } from "../model/item";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  form: FormGroup;
  items: Items | undefined;
  item: Item[] = [new Item(69, "meat ball", "very tasty", 1),
                  new Item(70, "armchar", "comfortable and thick", 2)];
  isDeleting = false;
  loading = false;
  isLoggedIn = false;
  submitted = false;
  active = true;

  constructor(private route: ActivatedRoute,
              private service: ItemsService,
              private router: Router,
              private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) this.isLoggedIn = true;
    this.getItems();
  }

  get formControls() { return this.form.controls; }

  getItems(): void {
    let idStr = this.route.snapshot.paramMap.get('id');

    if (idStr == null) {
      console.log("null id in getItems of ItemsDetailsComponent");
      return;
    }
    let id = +idStr;

    this.service.getItems(+id).subscribe(
      (response: Items) => {
        this.items = response;

        // convert UTC times to typescript dates
        this.items.started = new Date();
        this.items.ends = new Date();
        this.items.started.setTime(this.items.startedUTC);
        this.items.ends.setTime(this.items.endsUTC);

        // check if auction is active
        let now: Date = new Date();
        if (!this.items) return;
        if ((now > this.items.ends) || (this.items.currentBid >= this.items.buyPrice))
          this.active = false;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  addBid(): void {
    this.submitted = true;

    // get username
    let username = localStorage.getItem('username');
    if (!this.items || !username) return;

    // check if bid amount is valid
    let value = this.formControls['amount'].value;
    if (value <= this.items.currentBid || value < this.items.firstBid) {
      alert("Your bid must be higher than the current bid. If this is the first bid, it should be higher than" +
        " the minimum first bid amount set by the seller (check auction details)");
      return;
    }

    // check if auction has run out of time
    let now: Date = new Date();
    if ((now > this.items.ends) || (this.items.currentBid >= this.items.buyPrice)) {
      alert("This auction is no longer available. It has either expired or the items have been bought already.");
      return;
    }

    this.loading = true;

    this.service.addBid(this.items.id, value, username).subscribe(
      () => {
        alert("Bid Placed!");
        this.loading = false;
      },
      error => {
        alert(error.message);
        this.loading = false;
      }
    );

    // check if bid amount is above buy price
    if (value >= this.items.buyPrice) {
      alert("Congratulations! Your bid was higher than the buy price. You will be able to speak to the seller shortly.");
      this.active = false;
    }
  }

}
