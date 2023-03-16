import { Component } from '@angular/core';
import { navbarData } from './nav-data';
import { CookieService } from "ngx-cookie-service"

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  constructor(private cookie: CookieService) { }

  collapsed = false;
  navData = navbarData;

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
  }
  closeSidenav():void{
    this.collapsed = false;
  }
  signOut(){
    this.cookie.delete('jwtToken');
  }
}
