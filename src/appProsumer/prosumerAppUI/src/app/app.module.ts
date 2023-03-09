import { NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SingupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
