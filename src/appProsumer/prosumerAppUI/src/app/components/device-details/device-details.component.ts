import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit, AfterViewInit {

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

  showPermissions(){
    this.router.navigate(['/permissions', this.deviceId]);
  }

  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  @ViewChild('chart', {static: true}) chartElement: ElementRef | undefined = undefined;

  ngAfterViewInit() {
    if (this.chartElement){
  const ctx = this.chartElement.nativeElement.getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'],
      datasets: [{
        label: 'Power Usage',
        data: [12, 15, 20, 18, 25, 23, 19, 22, 17, 14, 16, 21, 24, 26],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Power Usage (kW)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        }
      }
    }
    
  });
}
}

}
