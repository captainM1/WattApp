import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { ResetComponent } from './components/reset/reset.component';

import { ProfileProsumerComponent } from './components/profile-prosumer/profile-prosumer.component';
import { MobNavComponent } from './components/mob-nav/mob-nav.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { NotauthGuard } from './guards/notauth.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditDeviceComponent } from './components/edit-device/edit-device.component';
import { NavComponent } from './components/nav/nav.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'signin', component: LoginComponent, canActivate:[NotauthGuard]
  },
  {
    path:'signup', component: SignupComponent
  },
  {
    path:'reset', component: ResetComponent
  },
  {
    path:'home',component:HomeComponent,canActivate:[AuthGuard]
  },
  {
    path: 'add-device', component: AddDeviceComponent
  },
  {
    path: 'edit-profile', component: EditProfileComponent
  },
  {
    path: 'edit-device', component: EditDeviceComponent
  },
  
  {
    path:'mob-nav', component:MobNavComponent
  },
  {
    path:'nav', component:NavComponent
  },
  {
    path:'profile-prosumer', component:ProfileProsumerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
