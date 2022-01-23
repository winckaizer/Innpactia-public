import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientComponent } from './components/client/client.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './components/user/user.component';
import { RepairComponent } from './components/repair/repair.component';
import { PhoneComponent } from './components/phone/phone.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RepairListComponent } from './components/repair-list/repair-list.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        ClientComponent,
        UserComponent,
        RepairComponent,
        PhoneComponent,
        RepairListComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
		NgbModule,
		ToastrModule.forRoot(),
		NgSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
