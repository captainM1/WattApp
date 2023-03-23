import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MapsComponent } from './components/maps/maps.component';
import { NavComponent } from './nav/nav.component';
import { navData } from './nav/navData';


const routes: Routes = [
  {
    path: 'signin', component: LoginComponent
  },
  {
    path: 'maps', component:MapsComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path:'nav',component:NavComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
