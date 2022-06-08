import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { Items } from "../model/items";
import { ItemsService } from "../services/items.service";
import { ActivatedRoute } from "@angular/router";
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
  form: FormGroup;

  constructor (private service: ItemsService,
               private route: ActivatedRoute,
               private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      itemSearch: ['']
    });
  }

  ngOnInit(): void {
    // get the final part of the url path
    if (!this.route.parent) return;

    // If we are on /myItems, get only items belonging to user
    if (this.route.parent.snapshot.url[0].path === "myItems") {
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

  // filter items through search
  onSubmit(): void {
    this.loading = true;
    this.finalItems = [];

    // only show auctions that contain at least one item with a name similar to the search
    for (let items of this.allItems) {
      for (let item of items.items) {
        if (item.name.toLowerCase().includes(this.form.value['itemSearch'].toLowerCase())) {
          this.finalItems.push(items);
          break;
        }
      }
    }

    this.loading = false;
  }

}
