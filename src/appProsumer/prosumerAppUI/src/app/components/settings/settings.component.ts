import { Component , OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  allowAccess = false;
  allowControl = false;

  constructor(private apiService: SettingsService, private auth: AuthService, private cookie: CookieService) { }

  ngOnInit(): void {
    this.apiService.getShareInfo().subscribe(
      (info) => {
        console.log(info);
        this.allowAccess = info;
    },
    (error) => {
      console.log(error);
    });
    console.log(this.cookie.get('jwtToken'));
  }

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
