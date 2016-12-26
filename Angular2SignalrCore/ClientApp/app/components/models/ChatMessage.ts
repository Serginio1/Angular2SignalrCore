export class ChatMessage {
    public Message: string;
    public Sent: Date;

    constructor(message: string, date: Date) {
        this.Message = message;
        this.Sent =date;
    }

   
}