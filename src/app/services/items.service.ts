import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Items } from "../model/items";
import { Bid } from "../model/bid";
import {Seller} from "../model/seller";

const httpOptions = {
  headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private itemsUrl ='https://localhost:8443/items';
  private itemsOfSellerUrl ='https://localhost:8443/itemsOfSeller';
  private sellerOfItemsUrl ='https://localhost:8443/sellerOfItems';

  constructor (private http: HttpClient) { }

  getAllItems(): Observable<Items[]> {
    return this.http.get<Items[]>(this.itemsUrl);
  }

  getItemsOfSeller(sellerId: number): Observable<Items[]> {
    return this.http.get<Items[]>(this.itemsOfSellerUrl + "/" + sellerId);
  }

  getSellerFromItems(itemsId: number): Observable<Seller> {
    return this.http.get<Seller>(this.sellerOfItemsUrl + "/" + itemsId);
  }

  getItems(itemsId: number): Observable<Items> {
    return this.http.get<Items>(this.itemsUrl+"/"+itemsId);
  }

  addItems(items: Items): Observable<any> {
    return this.http.post(this.itemsUrl, items);
  }

  addBid(itemsId: number, amount : number, bidderName : string): Observable<any> {
    return this.http.post(this.itemsUrl+"/"+itemsId, new Bid(amount, bidderName));
  }

  updateItems(items: Items, itemsId: number): Observable<any> {
    return this.http.put(this.itemsUrl+"/"+itemsId, items);
  }

  deleteItems(itemsId: number): Observable<any> {
    return this.http.delete(this.itemsUrl+"/"+itemsId);
  }
}


