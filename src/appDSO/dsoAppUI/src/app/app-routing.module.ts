import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MapsComponent } from './components/maps/maps.component';

const routes: Routes = [
  {
    path: 'signin', component: LoginComponent
  },
  {
    path: 'maps', component: MapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
