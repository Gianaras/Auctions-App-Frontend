export class Bid {
  amount: number = -1;
  bidderName: string = "";

  constructor(amount: number, bidderName: string) {
    this.amount = amount;
    this.bidderName = bidderName;
  }
}

