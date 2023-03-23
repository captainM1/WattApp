import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Device } from 'src/app/models/device.model';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  devices!: Device[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Device[]>(environment.apiUrl + '/api/devices').subscribe(devices => {
      this.devices = devices;
    });
  }
}
