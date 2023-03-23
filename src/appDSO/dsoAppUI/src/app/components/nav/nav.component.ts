import { Component } from '@angular/core';
import { navData } from './navData';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  navData = navData;
}
