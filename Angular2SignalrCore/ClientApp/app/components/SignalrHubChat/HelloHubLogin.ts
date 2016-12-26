import { Component, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { HelloHub } from '../services/HelloHubServise';

@Component({
    selector: 'p-HelloHubLogin',
    template: ` <div class="jumbotron">
        <h1>Добро пожаловать в чат</h1>
        <form class="navbar-form navbar-left" role="search" (ngSubmit)="SignUp()">
            <div class="form-group">
                <span>Введите имя пользователя</span>
                <input type="text" class="form-control" placeholder="Имя пользователя" [(ngModel)]="Login" name="Login">
            </div>
            <button  type="submit" class="btn btn-default" [disabled]="!isConnected">Войти</button>
        </form>
    </div>
`
})
export class HelloHubLoginComponent {
    public Login: string = "";
    public isConnected: Boolean;
    constructor(private _signalRService: HelloHub) {
        this.isConnected = this._signalRService.connectionExists;
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        let self = this;
        this._signalRService.onConnected.subscribe(() => {
            console.log('_signalRService.onConnected');
            self.isConnected = true;
        });
    }

    public SignUp() {
        if (this.Login == "") return;
        this._signalRService.connect(this.Login);

    }
}