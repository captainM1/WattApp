import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(
    private auth: AuthService,
    private router : Router){}

  signOut(){
    this.auth.signOut();
  }
}
