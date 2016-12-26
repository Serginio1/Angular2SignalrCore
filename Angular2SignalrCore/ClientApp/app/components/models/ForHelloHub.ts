
import { EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

export class User {
    constructor(public ConnectionId: string, public Name: string) { }
    }

export class ChatMessage {
    public Message: string;
    public Sent: Date;
    public From: SelectItem;
    constructor(message: string, date: Date, From: SelectItem) {
        this.Message = message;
        this.Sent = date;
        this.From = From;
    }


}
export  class DataInfo {
    constructor(public Data: Uint8Array, public isCompressed: boolean) { }

}

export  interface IHelloHub {

    sendEcho(str: string, Кому: string);
    sendByName(str: string, Кому: string);
    send(name2: string, message: string);
    sendFile(Кому: string, FileName: string, Data: DataInfo);


    evaluteCommand(Кому: string, command: string, Data: DataInfo);


    resultCommand(Кому: string, command: string, Data: DataInfo);

    // Подключение нового пользователя
    connect(userName: string);

        // События Клиенту
//Task addMessage(string Name, string str, string ConnectionId);
//Task getFile(string Name, string FileName, string ConnectionId, DataInfo Data);
//Task evaluteCommand(string Name, string command, string ConnectionId, DataInfo Data);
//Task resultCommand(string Name, string command, string ConnectionId, DataInfo Data);
//Task onConnected(string id, string userName, List < User > users);

//Task onNewUserConnected(string id, string userName);

//Task onUserDisconnected(string id, string Name);
    }