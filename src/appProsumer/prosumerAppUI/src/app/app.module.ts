import { NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {NgToastModule} from 'ng-angular-popup'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HomeComponent } from './components/home/home.component';
import { ResetComponent } from './components/reset/reset.component';


import { ProfileProsumerComponent } from './components/profile-prosumer/profile-prosumer.component';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { AddConsumerComponent } from './components/add-consumer/add-consumer.component';

import { EditDeviceComponent } from './components/edit-device/edit-device.component';
import { AddProducerComponent } from './components/add-producer/add-producer.component';
import { AddStorageComponent } from './components/add-storage/add-storage.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { NavComponent } from './components/nav/nav.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidenavComponent,
    HomeComponent,
    ProfileProsumerComponent,
    AddDeviceComponent,
    AddConsumerComponent,
    ResetComponent,
    ProfileProsumerComponent,
    EditDeviceComponent,
    AddProducerComponent,
    AddStorageComponent,
    NavComponent,
    EditProfileComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
