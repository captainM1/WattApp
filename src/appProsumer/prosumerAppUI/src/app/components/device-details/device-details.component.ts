import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit, AfterViewInit {

  device: any;
  deviceId: any;
  deviceHistory: any;
  deviceFuture: any;
  deviceToday: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
    
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysHistory/${this.deviceId}`)
        .subscribe(data => {
          this.deviceHistory = data;
          console.log(data);
        },
        error => {
          console.error('Error fetching device history:', error);
        })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/today/${this.deviceId}`)
        .subscribe(data => {
          this.deviceToday = data;
          console.log(data);
        },
        error => {
          console.error('Error fetching device today:', error);
        })
      
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysFuture/${this.deviceId}`)
        .subscribe(data => {
          this.deviceFuture = data;
          console.log(data);
        },
        error => {
          console.error('Error fetching device future:', error);
        })
        this.ngAfterViewInit();
  }

  goBack(){
    this.router.navigate(['/home2']);
  }
  del() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteDevice();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }
  deleteDevice(){
    this.http.delete(`${environment.apiUrl}/api/Device/delete-device/${this.deviceId}`)
    .subscribe(
      () => {
        this.router.navigate(['/home2']);
      },
      error => {
        console.log(error)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
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
  const chartData = this.deviceHistory.timestampPowerPairs.map((pair: { timestamp: string | number | Date; powerUsage: any; }) => ({
    x: new Date(pair.timestamp),
    y: pair.powerUsage,
  }));
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels:  chartData.map((data: { x: any; }) => data.x),
      datasets: [{
        label: 'Power Usage',
        data: chartData,
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
          },
          max: 4000
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
