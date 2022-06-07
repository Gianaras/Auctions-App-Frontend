export class Bid {
  amount: number = -1;
  bidderName: string = "";
  timeUTC: number = -1;
  date: Date = new Date();


  constructor(amount: number, bidderName: string) {
    this.amount = amount;
    this.bidderName = bidderName;
  }

}

