import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component'
import { TableComponent } from './components/table/table.component';

import { WeatherComponent } from './components/weather/weather.component';

import { RequirementsComponent } from './components/requirements/requirements.component';




const routes: Routes = [
  {
    path: 'signin', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path:'nav',component:NavComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'table',component: TableComponent
  },
  {

    path:'weather', component:WeatherComponent
  },
  {

    path: 'requirements', component: RequirementsComponent
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
