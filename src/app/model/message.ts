export class Message{
  content: string;
  sender:string;
  receiver:string;
  isRead:boolean=false;
  id:number=-1;
  date:Date = new Date();

  constructor(content:string,sender:string,receiver:string) {
    this.content=content;
    this.sender=sender;
    this.receiver=receiver;

  }
}
