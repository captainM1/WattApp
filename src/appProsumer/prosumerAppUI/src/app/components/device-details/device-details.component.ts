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
  deviceHistoryWeekPower: any = [];
  deviceFutureWeekPower: any = [];
  deviceHistoryWeekDate: any = [];
  deviceFutureWeekDate: any = [];
  deviceFutureMonthPower: any = [];
  deviceFutureMonthDate: any = [];
  deviceHistoryMonthPower: any = [];
  deviceHistoryMonthDate: any = [];
  hours: any = [];
  hourly: any = [];
  data: any = [];
  formattedLabels: any = [];
  deviceToday: any;
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
      },
      error => {
        console.error('Error fetching device information:', error);
      });
    
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysHistory/device/${this.deviceId}`)
        .subscribe((data:any) => {
          this.deviceHistoryWeekDate = data.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceHistoryWeekPower = data.timestampPowerPairs.map((time:any) => time.powerUsage);
        },
        error => {
          console.error('Error fetching device history:', error);
        })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/current/device/${this.deviceId}`)
        .subscribe(data => {
          this.deviceToday = data;
          console.log(data);
        },
        error => {
          console.error('Error fetching device today:', error);
        })
      
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysFuture/device/${this.deviceId}`)
        .subscribe((data:any) => {
          this.deviceFutureWeekDate = data.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceFutureWeekPower = data.timestampPowerPairs.map((time:any) => time.powerUsage);
          this.onOptionSelect();
        },
        error => {
          console.error('Error fetching device future:', error);
        })
      
      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/Next24h/device-usage_per_hour/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.hours = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.hourly = data.timestampPowerPairs.map((item: any) => item.powerUsage);
        console.log(data);
      },
      error => {
         console.error('Error fetching todays info:', error);
      })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/PreviousMonth/device-usage/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.deviceHistoryMonthDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.deviceHistoryMonthPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);
      },
      error => {
         console.error('Error fetching months history info:', error);
      })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/NextMonth/device-usage/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.deviceFutureMonthDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.deviceFutureMonthPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);
        
      },
      error => {
         console.error('Error fetching months history info:', error);
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
    this.data = this.hourly;
    this.formattedLabels = this.hours.map((date:any) => {
      const parsedDate = new Date(date);
      const hours = parsedDate.getHours() + 1;
      const minutes = parsedDate.getMinutes();
      return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    });
  } else if (this.selectedOption === 'Week') { 
    this.formattedLabels = [...this.deviceHistoryWeekDate, new Date(), ...this.deviceFutureWeekDate];
    this.formattedLabels = this.formattedLabels.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = [...this.deviceHistoryWeekPower, this.deviceToday, ...this.deviceFutureWeekPower];
  }
  else if (this.selectedOption === 'Last Month'){
    this.formattedLabels = this.deviceHistoryMonthDate.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = this.deviceHistoryMonthPower;
  }
  else if (this.selectedOption === 'Next Month'){
    this.formattedLabels = this.deviceFutureMonthDate.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = this.deviceFutureMonthPower;
  }
  this.initializeChart();
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
