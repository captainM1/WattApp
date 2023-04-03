import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {

  device: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  )
  {}

  ngOnInit() {
    const deviceId = this.route.snapshot.paramMap.get('id');
    console.log(deviceId);

    this.http.get<any[]>(`${environment.apiUrl}/api/Device/devices/info/${deviceId}`)
      .subscribe(data => {
        this.device = data;
      });
    console.log(this.device);
  }

}
