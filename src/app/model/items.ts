import {Item} from "./item";
import {Bid} from "./bid";
import {Seller} from "./seller";
import {Category} from "./category";
import {Location} from "./location"

export class Items {
  id: number;
  items: Item[] = [];
  bids: Bid[] =[];
  categories: Category[] = [];
  currentBid: number;
  buyPrice: number;
  firstBid: number;
  numberOfBids: number;
  startedUTC: number;
  endsUTC: number;
  started: Date = new Date();
  ends: Date = new Date();
  seller: Seller;
  location: Location;

  constructor(id: number, currentBid: number, buyPrice: number, firstBid: number, numberOfBids: number,
              started: number, ends: number, seller: Seller, location: Location) {
    this.id = id;
    this.currentBid = currentBid;
    this.buyPrice = buyPrice;
    this.firstBid = firstBid;
    this.numberOfBids = numberOfBids;
    this.startedUTC = started;
    this.endsUTC = ends;
    this.seller = seller;
    this.location = location;
  }
}
