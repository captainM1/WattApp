import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { Info, User } from 'src/app/models/user';
import { Root } from 'src/app/models/weather';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

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
  currentConsumes!: any;
  currentProduces!: any;
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

  constructor(
		private auth : AuthService,
    private auth1 : AuthUserService,
	){}

  @ViewChild('myChart') myChart!: ElementRef;
  @ViewChild('hourlyTemp') hourlyTemp!: ElementRef;
  @ViewChild('currentPowerUsageGraph') currentPowerUsageGraph!:ElementRef;
  @ViewChild('currentProductionGraph') currentProductionGraph!:ElementRef;
  @ViewChild('currentMostConsumesGraph') currentMostConsumesGraph!:ElementRef;
  @ViewChild('currentMostProducesGraph') currentMostProducesGraph!:ElementRef;
  @ViewChild('previous24ConsumptionGraph') previous24ConsumptionGraph!:ElementRef;

  ngAfterViewInit(): void {
    this.showWeatherDetails();

  }



  ngOnInit(): void {
    this.getToken();
    this.numberOfDevices();

  }

  numberOfDevices(){
    this.auth.getDeviceData().subscribe(
    (response:any)=>{
      this.number = response.length;
      console.log(this.number);
    }
    );
  }

  currentMostProduces(id:any)
  {
    this.auth1.getCurrentMostProduces(id).subscribe(
      (response:any)=>{
        console.log(response);
        this.currentProduces = response.timestampPowerPairs[0].powerUsage.toFixed(2);
        this.id = response.id;
        this.halfDoughnutMostProduces(this.currentProduces);

      }
    )
  }

  currentMostConsumes(id:any)
  {
    this.auth1.getCurrentMostConsumes(id).subscribe(
      (response:any)=>{
        console.log(response);
        this.currentConsumes = response.timestampPowerPairs[0].powerUsage.toFixed(2);
        console.log(this.currentConsumes);
        this.id = response.id;
        console.log(response.id + "id");
        this.halfDoughnutMostConsumes(this.currentConsumes);
        this.halfDoughnutProduction(this.currentConsumes); //ovo je samo za prikaz jer nemamo production

      }
    )
  }

  currentUsageUser(id:any){
    this.auth1.getCurrentConsumptionSummary(id).subscribe(
      (response : any) => {
        this.currentUsage = response.toFixed(2);
        console.log(response);
        this.halfDoughnut(response);
      }
    )
  }

  currentProductionUser(id:any)
  {
    this.auth1.getCurrentProductionSummary(id).subscribe(
      (response : any) => {
        this.currentProduction = response.toFixed(2);
        //this.halfDoughnutProduction(response);
      }
    )
  }



  getToken(){
    this.token = this.auth.getToken();
    this.auth1.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
       console.log(this.userID);
       this.currentUsageUser(this.userID);
       this.currentProductionUser(this.userID);
       this.currentMostConsumes(this.userID);
       this.currentMostProduces(this.userID);
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



halfDoughnut(usage: any){
  const d = usage;
  const data = {
    labels: ['Energy consumption'],
    datasets: [
      {
        label: 'Energy consumption',
        data: [d, 1000-d],
        backgroundColor: ['#FF8811', '#ECEFF1'],
      },
    ],
  };

  const options = {
   circumference:180,
   rotation:270,
   aspectRation: 2



  };

  const chart = new Chart(this.currentPowerUsageGraph.nativeElement, {
    type: 'doughnut',
    data: data,
    options: options,
  });
}

halfDoughnutProduction(usage: any){
  const d = usage;
  const data = {
    labels: ['Energy production'],
    datasets: [
      {
        label: 'Energy production',
        data: [d, 1000-d],
        backgroundColor: ['#026670', '#ECEFF1'],
      },
    ],
  };

  const options = {
   circumference:180,
   rotation:270,
   aspectRation: 2



  };

  const chart = new Chart(this.currentProductionGraph.nativeElement, {
    type: 'doughnut',
    data: data,
    options: options,
  });
}


halfDoughnutMostConsumes(usage: any){
  const d = usage;
  const data = {
    labels: ['Energy consumption'],
    datasets: [
      {
        label: 'Energy consumption',
        data: [d, 1000-d],
        backgroundColor: ['#FF8811', '#ECEFF1'],
      },
    ],
  };

  const options = {
   circumference:180,
   rotation:270,
   aspectRation: 2



  };

  const chart = new Chart(this.currentMostConsumesGraph.nativeElement, {
    type: 'doughnut',
    data: data,
    options: options,
  });
}

halfDoughnutMostProduces(usage: any){
  const d = usage;
  const data = {
    labels: ['Energy production'],
    datasets: [
      {
        label: 'Energy production',
        data: [d, 1000-d],
        backgroundColor: ['#026670', '#ECEFF1'],
      },
    ],
  };

  const options = {
   circumference:180,
   rotation:270,
   aspectRation: 2



  };

  const chart = new Chart(this.currentMostProducesGraph.nativeElement, {
    type: 'doughnut',
    data: data,
    options: options,
  });
}

showDetails: boolean = true;
showWeatherDetails()
{

  this.showDetails = !this.showDetails;

  this.auth.getWeather().subscribe(
    (response: any) => {
      this.weather = response;
      const timeSlice = this.weather.hourly.time.slice(0, 24);
      const time = timeSlice.map((time) => {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return hours + ":" + minutes;
      });

      const labels = time;
      const data = {
        labels: labels,
        datasets: [
          {
            label: "Temperature hourly",
            data: this.weather.hourly.temperature_2m,
            fill: true,
            borderColor: "#026670",
            backgroundColor: "#31a0ac",
            tension: 0.1,
          },
        ],
      };
      const options: ChartOptions = {
        scales: {
          x: {
            title: {
              display: true,
              text: "Temperature in celsius and x hourly",
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
              text: "Temperature (°C)",
            },
            ticks: {
              font: {
                size: 14,
              },
            },
          },
        },
      };


        const stackedLine = new Chart(
          this.hourlyTemp.nativeElement,
          {
            type: "line",
            data: data,
            options: options,
          }
        );

    }
  );


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




