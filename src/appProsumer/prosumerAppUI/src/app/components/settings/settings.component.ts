import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  allowAccess = false;
  allowControl = false;

  constructor(private apiService: SettingsService, private auth: AuthService) { }

  toggleAccess() {
    this.allowAccess = !this.allowAccess;
    console.log(this.allowAccess);
    this.apiService.allowAccessToInformation(this.allowAccess).subscribe();
  }

  toggleControl() {
    this.allowControl = !this.allowControl;
    this.apiService.allowControlConsumptionTime(this.allowControl).subscribe();
  }

  signOut(){
    this.auth.signOut();
  }
}
