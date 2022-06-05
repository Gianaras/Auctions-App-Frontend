import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Items } from "../model/items";

const httpOptions = {
  headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private itemsUrl ='https://localhost:8443/items';

  constructor (private http: HttpClient) { }

  getAllItems(): Observable<Items[]> {
    return this.http.get<Items[]>(this.itemsUrl);
  }

  getItems(itemsId: number): Observable<Items> {
    return this.http.get<Items>(this.itemsUrl+"/"+itemsId);
  }

  addItems(items: Items): Observable<any> {
    return this.http.post(this.itemsUrl, items);
  }

  deleteItems(itemsId: number): Observable<any> {
    return this.http.delete(this.itemsUrl+"/"+itemsId);
  }
}


