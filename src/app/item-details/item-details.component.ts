import { Component, OnInit } from '@angular/core';
import { Items } from "../model/items";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemsService } from "../services/items.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {User} from "../model/user";
import {Seller} from "../model/seller";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  form: FormGroup;
  items: Items | undefined;
  isDeleting = false;
  loading = false;
  isLoggedIn = false;
  isMine = false; // whether the auction seller is the currently logged-in user
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

        //convert UTC times to dates for all bids
        for(let bid of this.items.bids){
          bid.date = new Date();
          bid.date.setTime(bid.timeUTC);
        }
        //sort bid array to display latest bids first
        this.items.bids.sort(
          (bid1, bid2) => bid2.date.getTime() - bid1.date.getTime(),
        );

        // check if auction is active
        let now: Date = new Date();
        if (!this.items) return;
        if ((now > this.items.ends) || (this.items.currentBid >= this.items.buyPrice))
          this.active = false;

        // check if this auction belongs to logged-in user
        if (this.isLoggedIn)
          this.isThisMine();
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

    // refresh
    this.getItems();
  }

  // check whether the auction seller is the currently logged-in user
  isThisMine(): void {
    let userString: string | null = localStorage.getItem('user');
    if (!userString) return;
    let myUser: User = JSON.parse(userString);

    if (!this.items) return;
    this.loading = true;

    this.service.getSellerFromItems(this.items.id).subscribe(
      (response) => {
        let sellerTmp: Seller = response;
        this.loading = false;

        if (sellerTmp && this.items) {
          this.items.seller = sellerTmp;
          if (this.items.seller.id == myUser.seller.id)
            this.isMine = true;
        }
      },
      error => {
        alert(error.message);
        this.loading = false;
      }
    );
  }

}
