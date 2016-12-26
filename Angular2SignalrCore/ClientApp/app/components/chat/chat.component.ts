import { Component, NgZone, ViewChild  } from '@angular/core';
import { SignalRService } from '../services/signalRService';
import { ChatMessage } from '../models/ChatMessage';
import { SelectItem } from 'primeng/primeng';
import { Dropdown2 } from '../Dropdown/Dropdown';

class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

@Component({
    selector: 'chat-component',
    template: require('./chat.component.html')
})


export class ChatComponent {
    @ViewChild(Dropdown2)
    private dropdown2: Dropdown2;

    public currentMessage: ChatMessage;
    public allMessages: ChatMessage[];
    public canSendMessage: Boolean;
    public Users: SelectItem[];
    public selectedUser: string;
    public text: string;
    constructor(private _signalRService: SignalRService, private _ngZone: NgZone) {
        this.subscribeToEvents();
        console.log('constructor ChatComponent');
         this.canSendMessage = this._signalRService.connectionExists;
        this.currentMessage = new ChatMessage('', null);
        
        this.allMessages = this._signalRService.allMessages;//new Array<ChatMessage>();
      //  this.Users = new Array<SelectItem>();
      //  this.Users.push({ label: "Всем", value: new Date });
        this.Users = [{ label: "Всем", value: new Date }];
    }

    public sendMessage() {
        if (this.canSendMessage) {
            this.currentMessage.Sent = new Date();
            // this._signalRService.sendChatMessage(this.currentMessage);
            this._signalRService.SendMessage(this.currentMessage.Message);
        }
    }

    private subscribeToEvents(): void {
        this._signalRService.connectionEstablished.subscribe(() => {
            this.canSendMessage = true;
        });

        this._signalRService.messageReceived.subscribe((message: ChatMessage) => {
            this._ngZone.run(() => {
                this.currentMessage = new ChatMessage('', null);
              //  this.allMessages.push(new ChatMessage(message.Message, message.Sent));
                this.allMessages = this._signalRService.allMessages;
            });
        });
    }

    public insertUser()
    {
        console.log(`insertUser  ${this.text}`);

        if (this.text == "") return;

        let usr = { label: this.text, value: Guid.newGuid() };
        this.Users.push(usr);
        this.Users.sort((a, b: SelectItem) =>
        {
            if (a.label == "Всем") return -1;

            return a.label.toLocaleUpperCase().localeCompare(b.label.toLocaleUpperCase());
           
        });
        this.text = "";
    }
}