import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { User } from 'src/app/models/user';
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
  isViewInitialized = false;
  currentConsumes!: any;
  currentProduces!: any;
  id!:any;

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

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.showWeatherDetails();

  }



  ngOnInit(): void {
    this.getToken();


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
        this.halfDoughnutMostConsumes(this.currentConsumes);

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
        this.halfDoughnutProduction(response);
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
        backgroundColor: ['#026670', '#ECEFF1'],
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

showDetails: boolean = false;
showWeatherDetails()
{
  if (!this.isViewInitialized) {
    return;
  }
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
            backgroundColor: "#7ed1da",
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
}




