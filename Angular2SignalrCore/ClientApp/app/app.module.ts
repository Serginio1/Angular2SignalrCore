import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { MyComponent } from './components/MyComponent/MyComponent';
import { DataTableCMDemo } from './components/DataTable/datatablecmdemo';
import { Dropdown2 } from './components/Dropdown/Dropdown';

//import { DataTableModule} from './components/components/datatable/datatable';
//import { SharedModule } from './components/components/common/shared';
import { DataTableModule, SharedModule, ButtonModule, InputTextModule, DropdownModule } from 'primeng/primeng';
import { SignalRService } from './components/services/signalRService';
import { HelloHub } from './components/services/HelloHubServise';
import { ChatComponent } from './components/chat/chat.Component';
import { HelloHubApp } from './components/SignalrHubChat/HelloHubApp';
import { HelloHubLoginComponent } from './components/SignalrHubChat/HelloHubLogin';
import { HelloHubComponent } from './components/SignalrHubChat/SignalRHelloHub';
//import { HelloHubLogin} from './components/SignalrHubChat/HelloHubLogin';

import { FormsModule } from '@angular/forms';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        MyComponent,
        DataTableCMDemo,
        ChatComponent,
        Dropdown2
        , HelloHubLoginComponent
       , HelloHubApp
      ,HelloHubComponent
  //    , HelloHubLogin
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        DataTableModule, SharedModule, ButtonModule, InputTextModule, DropdownModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'myComponent', component: MyComponent }, 
            { path: 'mydatatable', component: DataTableCMDemo },
            { path: 'mysignalr', component: ChatComponent },
            { path: 'signalrHello', component: HelloHubApp},
            { path: '**', redirectTo: 'home' }
        ])
    ],


    providers: [
        SignalRService, HelloHub
    ]
})
export class AppModule {
}
