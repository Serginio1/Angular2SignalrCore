import { Component} from '@angular/core';
import { HelloHub } from '../services/HelloHubServise';

@Component({
    selector: 'p-HelloHubAppComponent',
  //  template:``
    template: `
<div class="container" id="MainDiv">
<p-HelloHubLogin *ngIf="!canSendMessage"></p-HelloHubLogin>
<p-HelloHubComponent *ngIf="canSendMessage"></p-HelloHubComponent>
</div>
`
    //<p-HelloHubLogin *ngIf="!canSendMessage"></p-HelloHubLogin>
})
export class HelloHubApp{
    public canSendMessage: Boolean;
    constructor(private _signalRService: HelloHub) {
        this.subscribeToEvents();
        this.canSendMessage = this._signalRService.isRegistered;
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {

        let self = this;
        this._signalRService.onRegistered.subscribe(() => {
            self.canSendMessage = true;
            console.log('self.canSendMessage = true;');
        });
    }
}