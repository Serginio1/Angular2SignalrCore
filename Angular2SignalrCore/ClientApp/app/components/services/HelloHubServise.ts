/// <reference path="../models/ForHelloHub.ts"/>
import { IHelloHub, DataInfo, ChatMessage, User}  from "../models/ForHelloHub";
import { EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
declare var $: any;

export class HelloHub implements IHelloHub
{
    public allMessages: ChatMessage[];
    public connectionExists: Boolean;
    public isRegistered: Boolean;
    private server: any;
    private client: any;
    private chat: any;
    private userId: string;
    public Users: SelectItem[];
    public onChangeUser: EventEmitter<void> = new EventEmitter<void>(); 
    public onAddMessage: EventEmitter<void> = new EventEmitter<void>();
    public onConnected: EventEmitter<void> = new EventEmitter<void>();
    public onRegistered: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
        this.userId = "";
        this.Users = [{ label: "Всем", value: ""}];
        this.connectionExists = false;
        this.isRegistered = false;

        this.chat = $.connection.helloHub;
        this.server = this.chat.server;
        this.client = this.chat.client;
        this.registerOnServerEvents();
        this.allMessages = new Array<ChatMessage>();
        this.startConnection();
    }

    private sortUsers() {
        this.Users.sort((a, b: SelectItem) => {
            if (a.label == "Всем") return -1;

            return a.label.toLocaleUpperCase().localeCompare(b.label.toLocaleUpperCase());

        });

    }

    private registerOnServerEvents(): void {

        let self = this;

        //Task addMessage(string Name, string str, string ConnectionId);
        this.client.addMessage = (name: string, message: string, ConnectionId: string) => {
            // Добавление сообщений на веб-страницу 
            console.log('addMessage ' + message);
            self.addMessage(name, message,ConnectionId);
        };


       
        //Task onConnected(string id, string userName, List < User > users);
        this.client.onConnected = function (id: string, userName: string, allUsers: User[]) {
            self.isRegistered = true;
               self.userId = id;
            // Добавление всех пользователей
            for (let user of allUsers) {

                self.addUser(user.ConnectionId, user.Name);
               }

            self.sortUsers();

            self.onRegistered.emit();
        };


        //Task onNewUserConnected(string id, string userName);
        // Добавляем нового пользователя
        this.client.onNewUserConnected = (id: string, name: string) => {

            self.addUser(id, name);
        };

        //Task onUserDisconnected(string id, string Name);
        // Удаляем пользователя
        this.client.onUserDisconnected = (id: string, userName: string) => {
           
            let idx = self.Users.findIndex((cur: SelectItem) => {
                return cur.value == id;
            });

            if (idx != -1) {
                return self.Users.splice(idx, 1); 

        };

}
       
    }

    findUser(userName:string,id: string): SelectItem
    {
        let idx = this.Users.findIndex((cur: SelectItem) => {
            return cur.value == id;
        });

        if (idx != -1) {
            return this.Users[idx];
        }
        return { label: userName, value:id }
         
    }
    // Кодирование тегов
    addMessage(name: string, message: string, ConnectionId: string): void {

        this.allMessages.splice(0, 0, new ChatMessage(message, new Date, this.findUser(name, ConnectionId)));
        this.onAddMessage.emit();

    }

    addUser(id: string, name: string): void {
        if (this.userId === "") return;

        if (this.userId !== id) {
            let usr = { label: name, value: id };
            this.Users.push(usr);
            this.sortUsers();
            this.onChangeUser.emit();
        }
    }

    private startConnection(): void {
        let self = this;
        $.connection.hub.start().done((data: any) => {
            console.log('startConnection ' + data);
            self.connectionExists = true;
            self.onConnected.emit();
            console.log('Send  onConnected');
        }).fail((error) => {
            console.log('Could not connect ' + error);

        });
    }

//======= методы и события сервера
    sendEcho(str: string, Кому: string)
    {

        this.server.sendEcho(str, Кому);
    }
    sendByName(message: string, Кому: string)
    {

        this.server.sendByName(message, Кому);
    }
    send(name2: string, message: string)
    {
        this.server.sendByName(name2, message);

    }
    sendFile(Кому: string, FileName: string, Data: DataInfo)
    {
    }


    evaluteCommand(Кому: string, command: string, Data: DataInfo)
    {
    }


    resultCommand(Кому: string, command: string, Data: DataInfo)
    {
    }

    // Подключение нового пользователя
    connect(userName: string)
    {
        this.server.connect(userName);

    }

  
}