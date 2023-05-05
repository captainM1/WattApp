import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  allowAccess = false;
  allowControl = false;

  constructor(private apiService: SettingsService) { }

  toggleAccess() {
    this.allowAccess = !this.allowAccess;
    console.log(this.allowAccess);
    this.apiService.allowAccessToInformation(this.allowAccess).subscribe();
  }

  toggleControl() {
    this.allowControl = !this.allowControl;
    this.apiService.allowControlConsumptionTime(this.allowControl).subscribe();
  }
}
