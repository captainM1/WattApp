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
  deviceHistoryPower: any = [];
  deviceFuturePower: any = [];
  deviceHistoryDate: any = [];
  deviceFutureDate: any = [];
  deviceFuture: any;
  deviceToday: any;
  devicevalue: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  )
  {}

  ngOnInit() {
    this.devicevalue = [1547.1628184460005, 1361.668379484121, 1425.6573144263273, 1677.3219977893327, 1308.1489318333208, 1679.8423387365494, 1484.189057002573];
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
          this.deviceHistoryDate = this.deviceHistory.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceHistoryPower = this.deviceHistory.timestampPowerPairs.map((time:any) => time.powerUsage);
          console.log(this.deviceHistoryPower);
          console.log(this.deviceHistoryDate);
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
          this.deviceFutureDate = this.deviceFuture.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceFuturePower = this.deviceFuture.timestampPowerPairs.map((time:any) => time.powerUsage);
          console.log(this.deviceFuturePower);
          console.log(this.deviceFutureDate);
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
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.deviceHistoryDate,
      datasets: [{
        label: 'Power Usage',
        data: this.deviceHistoryPower,
        fill: true,
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
          max: 3000,
          min:1000
        },
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        },
      }
    }
    
  });
}
}

}
