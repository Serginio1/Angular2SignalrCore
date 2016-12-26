/// <reference path="../models/ForHelloHub.ts"/>
import { IHelloHub, DataInfo, ChatMessage, User } from "../models/ForHelloHub";
import { EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
declare var $: any;

export class HelloHub implements IHelloHub {
    // Все сообщения
    public allMessages: ChatMessage[];
    // Флаг подключения к Хабу
    public connectionExists: Boolean;
    // Пользователь зарегистрировал имя
    public isRegistered: Boolean;
    // $.connection.helloHub.server
    private server: any;
    // $.connection.helloHub.client
    private client: any;
    // $.connection.helloHub
    private chat: any;

    // ID подключения
    private userId: string;
    // Подключенные пользователи
    public Users: SelectItem[];
    // Событие об изменении списка пользователей
    public onChangeUser: EventEmitter<void> = new EventEmitter<void>();
    // Событие о получении сообщения
    public onAddMessage: EventEmitter<void> = new EventEmitter<void>();
    // Событие о подключении к хабу
    public onConnected: EventEmitter<void> = new EventEmitter<void>();
    // Событие о регистрации имент пользователя.
    public onRegistered: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
        this.userId = "";
        // Установим начальный список с именем "Всем". При его выборе
        // сообщения будут отправлены всем пользователям, кроме текущего
        this.Users = [{ label: "Всем", value: "" }];
        this.connectionExists = false;
        this.isRegistered = false;

        this.chat = $.connection.helloHub;
        this.server = this.chat.server;
        this.client = this.chat.client;

        // Установим обработчики событий
        this.registerOnServerEvents();
        this.allMessages = new Array<ChatMessage>();

        // Подсоединимся к Хабу
        this.startConnection();
    }


    // Сортровка пользователей по имени. Всем должна быть первой
    private sortUsers() {
        this.Users.sort((a, b: SelectItem) => {
            if (a.label == "Всем") return -1;

            return a.label.toLocaleUpperCase().localeCompare(b.label.toLocaleUpperCase());

        });

    }


    //установим обработчики к событиям от сервера
    private registerOnServerEvents(): void {

        let self = this;


        // Событие о получении сообщения
        //Task addMessage(string Name, string str, string ConnectionId);
        this.client.addMessage = (name: string, message: string, ConnectionId: string) => {
            // Добавление сообщений на веб-страницу 
            console.log('addMessage ' + message);
            self.addMessage(name, message, ConnectionId);
        };


        // Событие о регистрации пользователя
        //Task onConnected(string id, string userName, List < User > users);
        this.client.onConnected = function (id: string, userName: string, allUsers: User[]) {
            self.isRegistered = true;
            self.userId = id;
            // Добавление всех пользователей
            for (let user of allUsers) {

                self.addUser(user.ConnectionId, user.Name);
            }

            self.sortUsers();
            // Сообщим об изменении списка пользователей
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

    // Найдем пользователя по id
    // Если не находим то создаем нового пользователя
    findUser(userName: string, id: string): SelectItem {
        let idx = this.Users.findIndex((cur: SelectItem) => {
            return cur.value == id;
        });

        if (idx != -1) {
            return this.Users[idx];
        }
        return { label: userName, value: id }

    }
    // Обработаем сообщение с сервера
    addMessage(name: string, message: string, ConnectionId: string): void {

        this.allMessages.splice(0, 0, new ChatMessage(message, new Date, this.findUser(name, ConnectionId)));
        this.onAddMessage.emit();

    }


    // Добавим пользователя и отсортируем по наименованию
    addUser(id: string, name: string): void {
        if (this.userId === "") return;

        if (this.userId !== id) {
            let usr = { label: name, value: id };
            this.Users.push(usr);
            this.sortUsers();
            this.onChangeUser.emit();
        }
    }

    // Подключимся к Хабу
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

    // Отошлем сообщение Всем или конкретному пользователю
    sendEcho(str: string, Кому: string) {

        this.server.sendEcho(str, Кому);
    }

    // Отошлем сообщение по имени
    sendByName(message: string, Кому: string) {

        this.server.sendByName(message, Кому);
    }


    send(name2: string, message: string) {
        this.server.sendByName(name2, message);

    }


    sendFile(Кому: string, FileName: string, Data: DataInfo) {
    }


    evaluteCommand(Кому: string, command: string, Data: DataInfo) {
    }


    resultCommand(Кому: string, command: string, Data: DataInfo) {
    }

    // Зарегистрироваться на сервере по имени
    connect(userName: string) {
        this.server.connect(userName);

    }


}