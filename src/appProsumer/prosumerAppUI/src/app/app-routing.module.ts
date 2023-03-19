import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileProsumerComponent } from './components/profile-prosumer/profile-prosumer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { NotauthGuard } from './guards/notauth.guard';

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
    path: 'profileConsumer', component: ProfileProsumerComponent
  },
  {
    path:'home',component:HomeComponent,canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
