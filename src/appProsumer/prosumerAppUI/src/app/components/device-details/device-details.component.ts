import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';



@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {

  device: any;
  deviceId: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  )
  {}

  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id');
    console.log(this.deviceId);

    this.http.get<any[]>(`${environment.apiUrl}/api/Device/devices/info/${this.deviceId}`)
      .subscribe(data => {
        this.device = data;
        console.log(data);
        console.log(this.device);
      },
      error => {
        console.error('Error fetching device information:', error);
      });
  }

  goBack(){
    this.router.navigate(['/home2']);
  }

  deleteDevice(){
    this.http.delete(`${environment.apiUrl}/api/Device/devices/delete/${this.deviceId}`)
    .subscribe(
      () => {
        console.log('Device deleted successfully');
        this.router.navigate(['/home2']);
      },
      error => {
        console.error('Error deleting device:', error);
      }
    );
  }

  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

}
