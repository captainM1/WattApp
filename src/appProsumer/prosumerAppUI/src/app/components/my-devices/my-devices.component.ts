import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.css']
})
export class MyDevicesComponent implements OnInit {
  devices: any;
  searchText: string = '';
  constructor(
    private auth: AuthService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.auth.getDeviceData().subscribe(
      (data) => {
        this.devices = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
