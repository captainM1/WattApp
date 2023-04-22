import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  

  constructor(
    private auth: AuthService,
    private router : Router,
    private confirmationService : ConfirmationService,
    private messageService : MessageService){}

  signOut(){
    this.auth.signOut();
    this.router.navigate(['signin']);
  }
  confirmSignOut(){
    this.confirmationService.confirm({
      message: 'Do you want to log out?',
      header: 'Log out',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.signOut();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }
}
