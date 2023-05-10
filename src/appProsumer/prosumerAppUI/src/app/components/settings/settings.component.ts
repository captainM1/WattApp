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
  requestSent = false;

  constructor(private apiService: SettingsService, private auth: AuthService, private cookie: CookieService) { }

  ngOnInit(): void {
    this.apiService.getShareInfo().subscribe(
      (info) => {
        this.allowAccess = info;
        
        if(info){ 
          this.apiService.getRuleInfo().subscribe(
            (info) => {
              this.allowControl = info;
          },
          (error) => {
            console.log(error);
          });


        }
    },
    (error) => {
      console.log(error);
    });
    console.log(this.cookie.get('jwtToken'));

    
  }

  toggleAccess() {
    if(!this.allowAccess){
      this.allowAccess = true;
      this.apiService.sendRequest().subscribe(
        (info) => {
          console.log("Success");
          this.requestSent = true;
        },
        (error) => {
          console.log(error);
        });
    }
  }

  toggleControl() {
    this.allowControl = !this.allowControl;
    this.apiService.allowControlConsumptionTime(this.allowControl).subscribe();
  }

  signOut(){
    this.auth.signOut();
  }
}
