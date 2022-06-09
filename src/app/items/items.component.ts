import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { Items } from "../model/items";
import { ItemsService } from "../services/items.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../model/user";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  allItems: Items[] = [];
  finalItems: Items[] = [];
  loaded = false;
  loading = false;
  selectedCategory: String = "none";
  form: FormGroup;
  isMyItems: boolean = false;

  constructor (private service: ItemsService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder,
               private router: Router) {
    this.form = this.formBuilder.group({
      itemSearch: [''],
      maxPrice: [''],
      locationSearch: ['']
    });
  }

  get formControls() { return this.form.controls; }

  ngOnInit(): void {
    // get the final part of the url path
    if (!this.route.parent) return;

    // If we are on /myItems, get only items belonging to user
    if (this.route.parent.snapshot.url[0].path === "myItems") {
      this.isMyItems = true;
      let userString: string | null = localStorage.getItem('user');
      if (!userString) return;
      let myUser: User = JSON.parse(userString);

      this.service.getItemsOfSeller(myUser.seller.id).subscribe(
        (response: Items[]) => {
            this.allItems = response;
            this.finalItems = this.allItems;
            this.loaded = true;
          },
        (error: HttpErrorResponse) => { alert(error.message); this.loaded = true; } );
    }
    else { // otherwise, just get all items
      this.service.getAllItems().subscribe(
        (response: Items[]) => {
            this.allItems = response;
            this.finalItems = this.allItems;
            this.loaded = true;
          },
        (error: HttpErrorResponse) => { alert(error.message); this.loaded = true; } );
    }
  }

  // filter items
  onSubmit(): void {
    this.loading = true;
    let tmpItems: Items[] = [];

    // only show auctions that contain at least one item with a name similar to the search
    for (let items of this.allItems) {
      for (let item of items.items) {
        if (item.name.toLowerCase().includes(this.form.value['itemSearch'].toLowerCase())) {
          tmpItems.push(items);
          break;
        }
      }
    }
    this.finalItems = tmpItems;

    // filter through budget
    tmpItems = [];
    if (this.form.value['maxPrice']) {
      for (let items of this.finalItems)
        if (Math.max(items.currentBid, items.firstBid) < this.form.value['maxPrice'])
          tmpItems.push(items);
      this.finalItems = tmpItems;
    }

    // filter through location
    tmpItems = [];
    for (let items of this.finalItems) {
      if (items.location.country.toLowerCase().includes(this.form.value['locationSearch'].toLowerCase())
        || items.location.location.toLowerCase().includes(this.form.value['locationSearch'].toLowerCase()))
          tmpItems.push(items);
    }
    this.finalItems = tmpItems;

    // filter through category
    tmpItems = [];
    if (this.selectedCategory != "none") {
      for (let items of this.finalItems) {
        for (let category of items.categories)
          if (category.id === this.selectedCategory) {
            tmpItems.push(items);
            break;
          }
      }
      this.finalItems = tmpItems;
    }

    this.loading = false;
  }

  // update the category selected in dropdown menu
  updateSelectedCategory(event: any): void {
    this.selectedCategory = event.target.value;
  }

  // route to new auction page
  reroute(): void {
    this.router.navigate(['/myItems/add']);
  }

}
