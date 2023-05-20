import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DeviceEditPopupComponent } from '../device-edit-popup/device-edit-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
  device: any;
  groupName: string = '';
  deviceId: any;
  deviceHistoryWeekPower: any = [];
  deviceFutureWeekPower: any = [];
  deviceHistoryWeekDate: any = [];
  deviceFutureWeekDate: any = [];
  deviceFutureMonthPower: any = [];
  deviceFutureMonthDate: any = [];
  deviceHistoryMonthPower: any = [];
  deviceHistoryMonthDate: any = [];
  last24HoursPower: any = [];
  last24HoursDate: any = [];
  next24HoursPower: any = [];
  next24HoursDate: any = [];
  hours: any = [];
  hourly: any = [];
  data: any = [];
  data1: any = [];
  formattedLabels: any = [];
  deviceToday: any = 0;
  chart:any;
  label1: string = '';
  label2: string = '';
  showSpinner: boolean = true;
  allowAccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private settings: SettingsService
  )
  {}

  ngOnInit() {
    this.spinner.show();
    this.deviceId = this.route.snapshot.paramMap.get('id');

    this.settings.getShareInfo().subscribe(
      (data) => {
        this.allowAccess = data;
        console.log(data);
      },
      (error) => {
        console.error('Error retrieving share information:', error);
      }
    );

    this.http.get<any[]>(`${environment.apiUrl}/api/Device/devices/info/${this.deviceId}`)
      .subscribe(data => {
        this.device = data;
        this.groupName = this.device.groupName;
      },
      error => {
        console.error('Error fetching device information:', error);
      });

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysHistory/device/${this.deviceId}`)
        .subscribe((data:any) => {
          this.deviceHistoryWeekDate = data.timestampPowerPairs.map((time:any) => time.timestamp);
          this.deviceHistoryWeekPower = data.timestampPowerPairs.map((time:any) => time.powerUsage);
          this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/7daysFuture/device/${this.deviceId}`)
            .subscribe((data:any) => {
              this.deviceFutureWeekDate = data.timestampPowerPairs.map((time:any) => time.timestamp);
              this.deviceFutureWeekPower = data.timestampPowerPairs.map((time:any) => time.powerUsage);
              this.onOptionSelect();
              this.showSpinner = false;
              this.spinner.hide();
            },
            error => {
              console.error('Error fetching device future:', error);
            })
            this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/today/currentPowerUsage/${this.deviceId}`)
            .subscribe(data => {
              data.forEach(item => {
                this.deviceToday += item.powerUsage;
              });
            },
            error => {
              console.error('Error fetching device today:', error);
            })
        },
        error => {
          console.error('Error fetching device history:', error);
        })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/Next24h/device-usage_per_hour/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.next24HoursDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.next24HoursPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);
      },
      error => {
         console.error('Error fetching todays info:', error);
      })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/Previous24h/device-usage_per_hour/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.last24HoursDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.last24HoursPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);
      },
      error => {
         console.error('Error fetching todays info:', error);
      })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/MonthPast/device/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.deviceHistoryMonthDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.deviceHistoryMonthPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);
      },
      error => {
         console.error('Error fetching months history info:', error);
      })

      this.http.get<any[]>(`${environment.apiUrl}/api/PowerUsage/power-usage/MonthFuture/device/${this.deviceId}`)
      .subscribe((data:any) =>{
        this.deviceFutureMonthDate = data.timestampPowerPairs.map((item: any) => item.timestamp);
        this.deviceFutureMonthPower = data.timestampPowerPairs.map((item: any) => item.powerUsage);

      },
      error => {
         console.error('Error fetching months history info:', error);
      })
  }

  goBack(){
    this.router.navigate(['/home']);
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
      },
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary'
    });
  }

  deleteDevice(){
    this.http.delete(`${environment.apiUrl}/api/Device/delete-device/${this.deviceId}`)
    .subscribe(
      () => {
        this.router.navigate(['/home']);
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
    this.data = this.last24HoursPower;
    this.data1 = this.next24HoursPower;
    this.formattedLabels = this.last24HoursDate.map((date:any) => {
      const parsedDate = new Date(date);
      const hours = parsedDate.getHours() + 1;
      const minutes = parsedDate.getMinutes();
      return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    });
    this.label1 = "Today's history";
    this.label2 = "Tomorrow's prediction";
  }
  else if (this.selectedOption === 'Week') {
    this.formattedLabels = [...this.deviceHistoryWeekDate, new Date(), ...this.deviceFutureWeekDate];
    this.formattedLabels = this.formattedLabels.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = [...this.deviceHistoryWeekPower, this.deviceToday, null, null, null, null, null, null];
    this.data1 = [null, null, null, null, null, null, null, this.deviceToday, ...this.deviceFutureWeekPower];
    this.label1 = "Last Week's History";
    this.label2 = "Next Week's Prediction";
  }
  else if (this.selectedOption === 'Month'){
    this.formattedLabels = [...this.deviceHistoryMonthDate, new Date(), ...this.deviceFutureMonthDate];
    this.formattedLabels = this.formattedLabels.map((date:any) => {
      const parsedDate = new Date(date);
      const month = parsedDate.getMonth() + 1;
      const day = parsedDate.getDate();
      return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    });
    this.data = [...this.deviceHistoryMonthPower, this.deviceToday,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null];
    this.data1 = [null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null,null, null, null, null, null, null, this.deviceToday, ...this.deviceFutureMonthPower];
    this.label1 = "Last Month's History";
    this.label2 = "Next Month's Prediction";
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
            label: this.label1,
            data: this.data,
            fill: true,
            borderColor: 'rgba(255, 136, 17, 0.91)',
            tension: 0.1
          },
          {
            label: this.label2,
            data: this.data1,
            fill: true,
            borderColor: 'rgba(2, 102, 112, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Power Usage [kWh]'
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
