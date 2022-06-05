import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { Items } from "../model/items";
import { ItemsService } from "../services/items.service";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  allItems: Items[] = [];

  constructor (private service: ItemsService) { }

  ngOnInit() {
    this.service.getAllItems().subscribe(
      (response: Items[]) => {
        this.allItems = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
