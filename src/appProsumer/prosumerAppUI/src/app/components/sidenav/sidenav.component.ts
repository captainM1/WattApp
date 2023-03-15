import { Component } from '@angular/core';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  collapsed = false;
  navData = navbarData;

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
  }
  closeSidenav():void{
    this.collapsed = false;
  }
}
