import { Injectable, EventEmitter } from '@angular/core';
import { ChatMessage } from '../models/ChatMessage';
//declare var $: JQueryStatic;
declare var $: any;

@Injectable()
export class SignalRService {

   

    public allMessages: ChatMessage[];
   
    public messageReceived: EventEmitter<ChatMessage>;
    public connectionEstablished: EventEmitter<Boolean>;
    public connectionExists: Boolean;
    private server: any;
    private client: any;
    private chat: any;
    constructor() {
        console.log('constructor ');
        this.connectionEstablished = new EventEmitter<Boolean>();
        this.messageReceived = new EventEmitter<ChatMessage>();
        
        this.connectionExists = false;

        this.chat = $.connection.coolmessages;
        this.server = this.chat.server;
        this.client = this.chat.client;
        this.registerOnServerEvents();
        this.allMessages = new Array<ChatMessage>();
        this.startConnection();
    }

    public sendChatMessage(message: ChatMessage) {
        this.server.SendMessage(message);
    }

    private startConnection(): void {
     //   console.log('$.connection.hub.start ' + $.connection.hub.start);
         $.connection.hub.start().done((data: any) => {
            console.log('connection ID= ' + data.id);
            this.connectionEstablished.emit(true);

            this.SendMessage("Всем привет");
            this.connectionExists = true;
        }).fail((error) => {
            console.log('Could not connect ' + error);
            this.connectionEstablished.emit(false);
        });
    }

    private registerOnServerEvents(): void {
        

        this.client.SendMessage=(data: ChatMessage)=>{
            console.log('received in SignalRService: ' + JSON.stringify(data));
            this.allMessages.splice(0, 0, data);
            this.messageReceived.emit(data);
        };

        
       
    }
    public SendMessage(message: string): void {
        let cm = new ChatMessage(message, new Date());
        this.server.sendMessage(cm);
    }
}
