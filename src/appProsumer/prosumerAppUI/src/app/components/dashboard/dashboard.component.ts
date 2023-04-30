import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  token!:any;
  userID!: any;
  timeStampConsumption =[];
  powerUsageConsumption = [];
  timeStrampConsumptionNextmonth = [];
  powerUsageConsumptionNextMonth = [];
  extractedDatesPrevMonth!:string[];
  extractedDatesNextMonth!:string[];
  consumptionPrevMonthUser!:[];
  consumptionNextMonthUser!:[];
  consPrev7Days = [];
  timeStrampConsumptionPrev7days = [];
  powerUsageConsumptionPrev7days = [];
  extractedDatesPrev7Days!:string[];

  constructor(
		private auth : AuthService,
    private auth1 : AuthUserService
	){}

  @ViewChild('consumptionPrevMonthGraph') consumptionPrevMonthGraph!:ElementRef;
  @ViewChild('consumptionNextMonthGraph') consumptionNextMonthGraph!:ElementRef;
  @ViewChild('consumptionPrev7daysGraph') consumptionPrev7daysGraph!:ElementRef;

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.getToken();
  }


  getToken(){
    this.token = this.auth.getToken();
    this.auth1.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
       console.log(this.userID);
       this.consumptionNextMonth(this.userID);
       this.consumptionPrevMonth(this.userID);
       this.consumptionPrev7Days(this.userID);
      }
    )
  }

  consumptionPrevMonth(id:any)
  {
    this.auth1.getConsumptionPrevMonth(id).subscribe(
      {
        next: (response : any) => {
          this.consumptionPrevMonthUser = response[0]['timestampPowerPairs'];


          for(let i = 0; i < this.consumptionPrevMonthUser.length; i++){
            this.timeStampConsumption.push(this.consumptionPrevMonthUser[i]['timestamp']);
            this.powerUsageConsumption.push(this.consumptionPrevMonthUser[i]['powerUsage']);
          }

            this.chartConsumptionPrevMonth();

          },
        error: () => {
          console.log("GRESKA.");
        }
      }
    );
  }

  consumptionNextMonth(id:any)
  {
        this.auth1.getConsumptionNextMonth(id).subscribe(
          {
            next: (response:any) => {
              console.log(response);
              this.consumptionNextMonthUser = response[0]['timestampPowerPairs'];
              console.log(this.consumptionNextMonthUser);
              for(let i = 0; i < this.consumptionNextMonthUser.length; i++){
                this.timeStrampConsumptionNextmonth.push(this.consumptionNextMonthUser[i]['timestamp']);
                this.powerUsageConsumptionNextMonth.push(this.consumptionNextMonthUser[i]['powerUsage']);

              }
                this.chartConsumptionNextMonthChart();
            },
            error : (err : any) => {
              console.log(err);
            }
          })
  }

  chartConsumptionPrevMonth(){
    for(let i = 0; i < this.timeStampConsumption.length; i++){
      const dateStringList = this.timeStampConsumption.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesPrevMonth = substrings.map(date => date.substring(0, date.indexOf('T')));

    }

    this.extractedDatesPrevMonth.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());


    const data = {
      labels: this.extractedDatesPrevMonth,
      datasets: [{
        label: 'Previous Month',
        data: this.powerUsageConsumption,
        fill: true,
        borderColor: 'rgb(255, 200, 0)',
        backgroundColor:'rgba(255, 200, 0,0.4)',
        pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
        borderWidth: 1,
        pointBorderColor:'rgb(255, 200, 0)'
      }]
    }
    const options: ChartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date ',
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Power Consumption (kW)'
          },
          ticks: {
            font: {
              size: 9,
            },
          },
        },
      },
    };
    const chart = new Chart(this.consumptionPrevMonthGraph.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }


  chartConsumptionNextMonthChart(){
    for(let i = 0; i < this.timeStampConsumption.length; i++){
      const dateStringList = this.timeStampConsumption.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesNextMonth = substrings.map(date => date.substring(0, date.indexOf('T')));

    }

    this.extractedDatesNextMonth.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const data = {
      labels: this.extractedDatesNextMonth,
      datasets: [{
        label: 'Next Month',
        data: this.powerUsageConsumptionNextMonth,
        fill: true,
					borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'
      }]
    }
    const options: ChartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date ',
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Power Consumption (kW)'
          },
          ticks: {
            font: {
              size: 8,
            },
          },
        },
      },
    };
    const chart = new Chart(this.consumptionNextMonthGraph.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }

  consumptionPrev7Days(id : any){
    this.auth1.getConsumptionPrev7days(id).subscribe({
      next:(response : any) => {
        this.consPrev7Days = response[0]['timestampPowerPairs'];
        this.makeDataGraphPrev7DaysConsumption(this.consPrev7Days);
        console.log(this.consPrev7Days);
        this.chartConsumptionPrev7Days();
      },
      error : (err : any) => {
        console.log("error consumptio previous 7 days");
      }
    })
  }


  makeDataGraphPrev7DaysConsumption(dataGraph : any){
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampConsumptionPrev7days.push(this.consPrev7Days[i]['timestamp']);
      this.powerUsageConsumptionPrev7days.push(this.consPrev7Days[i]['powerUsage']);
    }
  }

  chartConsumptionPrev7Days(){
    for(let i = 0; i < this.timeStrampConsumptionPrev7days.length; i++){
      const dateStringList = this.timeStrampConsumptionPrev7days.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesPrev7Days = substrings.map(date => date.substring(0, date.indexOf('T')));

    }
    console.log(this.extractedDatesPrev7Days);
    console.log(this.powerUsageConsumptionPrev7days);

    this.extractedDatesPrev7Days.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = {
      labels: this.extractedDatesPrev7Days,
      datasets: [{
        label: 'Previous 7 days Consumption',
        data: this.powerUsageConsumptionPrev7days,
        fill: true,
        borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'

      }]
    }

      const stackedLine = new Chart(this.consumptionPrev7daysGraph.nativeElement, {
        type: 'bar',
        data: data,

      });
  }


}



