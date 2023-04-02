import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {

  device: any;

  constructor(
    private route: ActivatedRoute
  )
  {}

  ngOnInit() {
    const deviceId = this.route.snapshot.paramMap.get('id');
    console.log(deviceId);
  }

}
