import { Component, OnInit } from '@angular/core';
import { Items } from "../model/items";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemsService } from "../services/items.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {User} from "../model/user";
import {Seller} from "../model/seller";
import {toBase64String} from "@angular/compiler/src/output/source_map";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  images:any = [];


  form: FormGroup;
  items: Items | undefined;
  canDelete = true;
  isDeleting = false;
  loading = false;
  isLoggedIn = false;
  isMine = false; // whether the auction seller is the currently logged-in user
  submitted = false;
  active = true;
  loaded = false; // only becomes true after we have resolved if this auction belongs to logged-in user
                  // (prevents bid placing and delete option showing during loading)

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
        for(let item of this.items.items){
          for(let image of item.images){
            console.log(image.image_data);
            let img = image.image_data;
            this.images.push(img);
          }
        }



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
    if (!this.items || !username || !this.items.id) return;

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
    if (!this.items || !this.items.id) return;
    this.loading = true;

    this.service.getSellerFromItems(this.items.id).subscribe(
      (response) => {
        let sellerTmp: Seller = response;
        this.loading = false;

        if (sellerTmp && this.items) {
          this.items.seller = sellerTmp;

          let userString: string | null = localStorage.getItem('user');
          if (!userString) return;
          let myUser: User = JSON.parse(userString);

          if (this.items.seller.id == myUser.seller.id)
            this.isMine = true;
          this.loaded = true;
        }
      },
      error => {
        alert(error.message);
        this.loading = false;
      }
    );
  }

  // delete Auction
  deleteItems(): void {
    this.getItems(); // refresh items to make sure no new bid has been placed
    if (!this.items || !this.items.id) return;

    // check if auction is active
    if (!this.active) {
      this.canDelete = false;
      alert("This auction cannot be deleted since it is no longer active.");
      return;
    }

    // check for bids
    if (this.items.bids && this.items.bids.length > 0) {
      this.canDelete = false;
      alert("This auction cannot be deleted since one or more bids have been placed.");
      return;
    }

    this.isDeleting = true;
    this.service.deleteItems(this.items.id).subscribe(
      () => {
        alert("Deletion successful!");
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error => {
        alert(error.message);
        this.isDeleting = false;
      }
    );
  }

  // go to edit page
  routeToEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  fromBinary(encoded:string) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }


  toBinary(string:string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }



  base64encode(str:string) {
    let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
    return btoa(encode)
  }
  base64decode(str:string) {
    let decode = atob(str).replace(/[\x80-\uffff]/g, (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`)
    return decodeURIComponent(decode)
  }

}
