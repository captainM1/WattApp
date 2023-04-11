import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component'
import { TableComponent } from './components/table/table.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';




const routes: Routes = [
  {
    path: 'signin', component: LoginComponent
  },
  
  {
    path:'nav',component:NavComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'table',component: TableComponent
  },
  {
    path: 'requirements', component: RequirementsComponent
  },
  {
    path:'profile-user',component:ProfileComponent
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
