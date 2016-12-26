import { Component, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { HelloHub } from '../services/HelloHubServise';
import { ChatMessage } from '../models/ForHelloHub';
import { SelectItem } from 'primeng/primeng';
import { Dropdown2 } from '../Dropdown/Dropdown';


@Component({
    selector: 'p-HelloHubComponent',
    template: require('./SignalRHelloHub.html')
})


export class HelloHubComponent {
    @ViewChild(Dropdown2)
    public dropdown: Dropdown2;

    public allMessages: ChatMessage[];
    public Users: SelectItem[];
    public selectedUser: string;
    public Message: string;
    public selectUsername: boolean = false;
    constructor(private _signalRService: HelloHub) {
        // Подключимся к событиям от сервиса
        this.subscribeToEvents();

        // Получим все сообщения полученные за время существования страницы
        this.allMessages = this._signalRService.allMessages;
        // Получим данные о пользователях
        this.Users = _signalRService.Users;

    }

    // Метод отправки сообщений взависимости от выбранных данных
    public sendMessage() {



        if (this.dropdown.value == "") // Если Выбран "Всем" отправлем  всем пользователям, кроме отправителя
        {
            this._signalRService.sendEcho(this.Message, "");
        }
        else {

            // В 1С может быть несколько пользователей с одним именем     
            if (!this.selectUsername) // Если не стоит галка "По Имени" то отправляем конкретному мользователю
                this._signalRService.sendEcho(this.Message, this.dropdown.value);
            else  // отправляем сообщение всем пользователям с выбранным именем
                this._signalRService.sendByName(this.Message, this.dropdown.selectedOption.label);
        }

        this.Message = "";

    }

    private subscribeToEvents(): void {

        let self = this;

        // Обновим данные о полученных сообщениях
        this._signalRService.onAddMessage.subscribe(() => {
            self.allMessages = this._signalRService.allMessages;
        });

        // Обновим данные о пользователях
        this._signalRService.onChangeUser.subscribe(() =>
        { this.Users = self._signalRService.Users; }
        );
    }


}