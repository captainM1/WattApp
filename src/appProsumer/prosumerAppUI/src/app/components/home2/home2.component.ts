import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { Info, User } from 'src/app/models/user';
import { Root } from 'src/app/models/weather';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { Observable, map, timer } from 'rxjs';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit, AfterViewInit {
  currentUsage! : any;
  currentProduction! : any;
  userID!: any;
  token!:any;
  weather! : Root;
  number!: any;
  devices!: any;
  id!:any;
  graph24prev!:any;
  powerUsageList: any = [];
  timestampList: any = [];
  numberOfProducers:number = 0;
  numberOfConsumers:number = 0;
  numberOfStorage:number = 0;
  allUserDevices!: Info[];
  currentDate!: Observable<Date>;
  savedEnergyMonthConsumption!: number;

  isSunny!: boolean;
  isCloudy!: boolean;
  isRainy!: boolean;
  isSnowy!: boolean;

  constructor(
		private auth : AuthService,
    private auth1 : AuthUserService
	){}


  @ViewChild('myChart') myChart!: ElementRef;
  @ViewChild('hourlyTemp') hourlyTemp!: ElementRef;
  @ViewChild('previous24ConsumptionGraph') previous24ConsumptionGraph!:ElementRef;

  ngAfterViewInit(): void {
    this.showWeatherDetails();

  }



  ngOnInit(): void {
    this.getToken();
    this.numberOfDevices();

    this.currentDate = timer(0,1000).pipe(
      map(()=>{
        return new Date();
      })
    )
  }

  numberOfDevices(){
    this.auth.getDeviceData().subscribe(
    (response:any)=>{
      this.number = response.length;
      console.log(this.number);
    }
    );
  }


  getToken(){
    this.token = this.auth.getToken();
    this.auth1.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
       console.log(this.userID);
       this.getConsumptionSevedEnergyMonth(this.userID);
       this.currentUsageUser(this.userID);
       this.currentProductionUser(this.userID);
       this.auth1.getConsumptionPrevious24Hours(this.userID).subscribe(
        (response : any) => {
          this.graph24prev = response;
          console.log(response);
          this.makeData(this.graph24prev);
        }
       );
       this.showMeDevices(this.userID);
      }
    )
  }

  getConsumptionSevedEnergyMonth(id:any)
  {
    this.auth1.getConsumptionSavedEnergyMonth(id).subscribe(
      (response:any)=>{
        this.savedEnergyMonthConsumption = response.toFixed(2);
      }
    )
  }


  currentUsageUser(id:any){
    this.auth1.getCurrentConsumptionSummary(id).subscribe(
      (response : any) => {
        this.currentUsage = response.toFixed(2);
        console.log(response);
      }
    )
  }

  currentProductionUser(id:any)
  {
    this.auth1.getCurrentProductionSummary(id).subscribe(
      (response : any) => {
        this.currentProduction = response.toFixed(2);
      }
    )
  }


showWeatherDetails()
{
  this.auth.getWeather().subscribe(
    (response: any) => {
      this.weather = response;
      this.isSunny = this.weather.current_weather.temperature > 15 && this.weather.hourly.relativehumidity_2m[0] < 30;
      this.isCloudy = (this.weather.current_weather.temperature <= 15 || this.weather.current_weather.temperature > 0)  && (this.weather.hourly.relativehumidity_2m[0] >= 30 || this.weather.hourly.relativehumidity_2m[0] < 90)
      this.isRainy =  this.weather.hourly.relativehumidity_2m[0] >= 90;
      this.isSnowy = this.weather.current_weather.temperature <= 0;
      console.log(this.isCloudy);
      });
}


makeData(dataGraph:any){
  dataGraph.forEach((obj:any) => {
    obj.timestampPowerPairs.forEach((pair:any) => {
      const time = pair.timestamp.split('T')[1].split(':')[0];
      this.timestampList.push(time);
      this.powerUsageList.push(pair.powerUsage);
    });
  });

  this.timestampList.sort((a: string, b: string) => {
    return parseInt(a) - parseInt(b);
  });
  this.previous24Graph(this.timestampList, this.powerUsageList);
}

previous24Graph(list:any, valueList:any){
  const data = {
    labels: list,
    datasets: [{
      label: 'Consumption For The Previous 24h',
      data: valueList,
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
          text: 'Time (hour)',
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Power consumption (kW)',
          font:{
            size: 10
          }
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };
  const graph = new Chart(this.previous24ConsumptionGraph.nativeElement, {
    type: 'line',
    data: data,
    options: options,
  });
}


showMeDevices(id : string){
  this.auth1.getDeviceInfoUserByID(id).subscribe(
    (response : any) => {
      this.allUserDevices = response;
      console.log(this.allUserDevices + "all devices");
      for(let us of this.allUserDevices){

      this.auth.getDevicesInfoByID(us.deviceId).subscribe({
        next: (response:any)=>{
          us.typeOfDevice = response.groupName;
          if(response.groupName === "Consumer"){
            this.numberOfConsumers++;
          }else if(response.groupName === "Prosumer"){
            this.numberOfProducers++;
          }else if(response.groupName === "Storage"){
            this.numberOfStorage++;
          }
        },
        error : (err : any)=>{
          console.log("err");
        }
      }); }
    }

  )
}





}




