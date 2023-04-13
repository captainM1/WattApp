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
export class DeviceDetailsComponent implements OnInit {

  device: any;
  deviceId: any;
  deviceHistory: any;
  deviceHistoryPower: any = [];
  deviceFuturePower: any = [];
  deviceHistoryDate: any = [];
  deviceFutureDate: any = [];
  hours: any = [];
  hourly: any = [];
  data: any = [];
  labels: any = [];
  formattedLabels: any = [];
  deviceFuture: any;
  deviceToday: any;
  devicevalue: any;
  chart:any;

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
          this.deviceHistoryDate = this.deviceHistory.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceHistoryPower = this.deviceHistory.timestampPowerPairs.map((time:any) => time.powerUsage);
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
          this.labels = [...this.deviceHistoryDate, new Date(), ...this.deviceFutureDate];
          this.onOptionSelect();
        },
        error => {
          console.error('Error fetching device future:', error);
        })
      
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/Previous24h/device-usage_per_hour/${this.deviceId}`)
      .subscribe(data =>{/*

        this.hours = data.map((item: any) => item.DateTime);
        this.hourly = data.map((item: any) => item.Number);

        console.log(this.hours);
        console.log(this.hourly);
        this.onOptionSelect();*/
      },
      error => {
         console.error('Error fetching todays info:', error);
      })
        
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
  selectedOption: string = 'Week';

  onOptionSelect() {
  if (this.selectedOption === 'Today') {
    this.data = [1600,1500,1485,1547,2147,1548,1584,1689,1584,1475,1578,1652,1600,1500,1485,1547,2147,1548,1584,1689,1584,1475,1578,1652];
    this.formattedLabels = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
    this.initializeChart();
  } else if (this.selectedOption === 'Week') {
    this.formattedLabels = this.labels.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = [...this.deviceHistoryPower, this.deviceToday, ...this.deviceFuturePower];
    this.initializeChart();
  }
  }

  initializeChart() {
    if (this.chartElement){
      
    if (this.chart) {
      this.chart.destroy();
    }
  const ctx = this.chartElement.nativeElement.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#FF8811');
  gradient.addColorStop(0.5,'#9747FF');
  gradient.addColorStop(1, '#9FEDD7');
  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.formattedLabels,
      datasets: [{
        label: 'Power Usage',
        data: this.data,
        fill: true,
        borderColor: gradient,
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
            text: 'Date'
          }
        },
      }
    }
    
  });
}
}

}
