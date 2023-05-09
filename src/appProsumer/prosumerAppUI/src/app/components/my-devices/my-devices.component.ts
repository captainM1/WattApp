import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.css']
})
export class MyDevicesComponent implements OnInit {
  devices: any;
  deviceToday: {[key: string]: any} = {};

  searchName: string = '';
  constructor(
    private auth: AuthService,
    private cookie: CookieService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.getDeviceData().subscribe(
      (data) => {
        console.log(data);
        this.devices = data;
        this.devices.forEach((device:any) => {
          this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/current/device/${device.deviceId}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) })
            .subscribe(data => {
              console.log(data);
              this.deviceToday[device.deviceId] = data;
            },
            error => {
              console.error('Error fetching device today:', error);
            });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
