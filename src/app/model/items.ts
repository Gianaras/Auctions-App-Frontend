export class Items {
  id: number;
  currentBid: number;
  buyPrice: number;
  firstBid: number;
  numberOfBids: number;
  startedUTC: number;
  endsUTC: number;
  started: Date = new Date();
  ends: Date = new Date();
  sellerId: number;
  locationId: number;

  constructor(id: number, currentBid: number, buyPrice: number, firstBid: number, numberOfBids: number,
              started: number, ends: number, sellerId: number, locationId: number) {
    this.id = id;
    this.currentBid = currentBid;
    this.buyPrice = buyPrice;
    this.firstBid = firstBid;
    this.numberOfBids = numberOfBids;
    this.startedUTC = started;
    this.endsUTC = ends;
    this.sellerId = sellerId;
    this.locationId = locationId;
  }
}
