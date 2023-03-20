import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { ResetComponent } from './components/reset/reset.component';

import { ProfileProsumerComponent } from './components/profile-prosumer/profile-prosumer.component';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { NotauthGuard } from './guards/notauth.guard';
import { EditDeviceComponent } from './components/edit-device/edit-device.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'signin', component: LoginComponent, canActivate:[NotauthGuard]
  },
  {
    path:'signup', component: SignupComponent
  },
  {
    path:'sidenav', component: SidenavComponent
  },
  {
    path: 'profile-prosumer', component: ProfileProsumerComponent
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
    path: 'edit-device', component: EditDeviceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
