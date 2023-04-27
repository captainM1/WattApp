import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers, eachDevice } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart, elements } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { User } from 'models/User';
import { animation } from '@angular/animations';
import { Root } from 'models/weather';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
	
	chartInstance!: Chart;
  	subscription!: Subscription;
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

	constructor(
		private auth : AuthService
	){}
	
// users
	totalUsers!: number;
	User! : User[];

// devices 
	deviceGroup!: deviceGroup[];
	deviceManifaturers!: deviceManifacturers[];
	deviceManifacturersByGroupID!: deviceGroupManifacturers[];
	deviceGroupByGroupID!: deviceGroupManifacturers[]; 

	producers!: deviceGroupManifacturers[];
	consumers! : deviceGroupManifacturers[];
	storage!: deviceGroupManifacturers[]; 
	
	total!: number;

	labProducers!: string[];
	labConsumers!: string[];
	labStorages!:string[];
	
// consumption 
	currentConsumptionSys!:any;
	prevMonthConsumptionSys!:any;
	nextMonthConsumptionSys!:any;
	prevMonthEachDeviceConsumption!: eachDevice[];

// production
	currentProcuctionSys!:any;
	prevMonthProductionSys!: any;
	prevMonextMonthConsumptionSys!:any;

// weather
	weather! : Root;
	today!:Date;
	MonthPrev!:Date;
	MonthNext!:Date;
	dateForWeater!:any;
	next!:any;
	month!:any;
	
	@ViewChild('myChart') myChart!: ElementRef;
	@ViewChild('myChartUsers') myChartUsers!:ElementRef;
	@ViewChild('myChartForEveryTypeOfDevice') myChartForEveryTypeOfDevice!: ElementRef;
	@ViewChild('hourlyTemp') hourlyTemp!: ElementRef;

	@ViewChild('currentConsumptionSYS') currentConsumptionSYS!:ElementRef;
	@ViewChild('prevMonthConsumptionSYS') prevMonthConsumptionSYS!:ElementRef;
	@ViewChild('nextMonthConsumptionSYS') nextMonthConsumptionSYS!:ElementRef;

	@ViewChild('currentProductionSYS') currentProductionSYS!:ElementRef;
	@ViewChild('prevMonthProductionSYS') prevMonthProductionSYS!:ElementRef;
	@ViewChild('nextMonthProductionSYS') nextMonthProductionSYS!:ElementRef;
	

	
	ngOnInit(): void {	
	
		// temperature
		this.giveMeWeather();

		this.getAllUserInfo();
		this.allDevices();
		this.getDate();
		this.getNumberOfUsers();
		this.getDeviceGroup();
		this.prevMonthEachDevice();
		this.eachDeviceConsumptingPrevMonth();
	
		
	}

	ngAfterViewInit(): void {
		this.giveMeChartForTemperatureDaily();
		
		this.getConsumptionCurrent();
		this.getConsumtionPrevMonth();
		this.getConsumtionNextMonth();

		this.getProductionCurrent();
		this.nextMonthProductionSystem();
		this.prevMonthProductionSystem();
		 
	}
	
	
	getDate(){
		this.today = new Date();
		this.dateForWeater = this.today.toLocaleString('en-US',{ hour: 'numeric', minute: 'numeric', day:'numeric', month:'numeric', year:'numeric' });

		this.MonthPrev = new Date(this.today.getFullYear(), this.today.getMonth() - 1);
		this.month = this.MonthPrev.toLocaleString('default', { month: 'long', year: 'numeric' });
		
		this.MonthNext = new Date(this.today.getFullYear(), this.today.getMonth() + 1);
		this.next =  this.MonthNext.toLocaleString('default', { month: 'long', year: 'numeric' });
	}
//  --- weater ---	
	giveMeWeather(){
		this.auth.getWeather().subscribe(
			(response :any)=>{
				this.weather = response;
				console.log(this.weather);
				
			}
		)
	}

	giveMeChartForTemperatureDaily(){
		const timeSlice = this.weather.hourly.time.slice(0,24);
		const time = timeSlice.map((time)=>{
			const date = new Date(time);
			const hours = date.getHours().toString().padStart(2,"0");
			const minutes = date.getMinutes().toString().padStart(2,"0");
			return hours+":"+minutes;
		})
		
		const labels = time;
		const data = {
		labels: labels,
		datasets: [{
			label: 'Hourly temperature change',
			data: this.weather.hourly.temperature_2m,
			fill: true,
			borderColor: 'rgb(98, 183, 254)',
			backgroundColor:'rgba(98, 183, 254,0.4)',
			pointBackgroundColor: 'rgba(98, 183, 254,0.7)',
			borderWidth: 1,
			pointBorderColor:'rgb(98, 183, 254)'
		}]
	}
	const options: ChartOptions = {
		scales: {
		  x: {
			title: {
			  display: true,
			  text: 'Temperature hourly',
			},
			ticks: {
			  font: {
				size: 13,
			  },
			},
		  },
		  y: {
			title: {
			  display: true,
			  text: 'Temperature (°C)',
			},
			ticks: {
			  font: {
				size: 15,
			  },
			},
		  },
		},
	  };
		const stackedLine = new Chart(this.hourlyTemp.nativeElement, {
			type: 'line',
			data: data,
			options: options,
		});
		
};
	
	
	getNumberOfUsers(){
		this.auth.getUserNumber().subscribe(
			(response : any) => {
				this.totalUsers = response;
			}
		)
	}

	getAllUserInfo(){
		this.auth.getAllUserInfo().subscribe(
			(response : any)=>{
				this.User = response;
			}
		)
	}
	
	getDeviceGroup(){
		this.auth.getDeviceGroup().subscribe(
			(response : any)=>{
				this.deviceGroup = response;
				for(let group of this.deviceGroup){
					 this.auth.getDeviceGroupID(group.id).subscribe(
						(response:any)=>{
							if(group.id === "77cbc929-1cf2-4750-900a-164de4abe28b")
							{
								this.producers = response;
								
							}else if(group.id === "18f30035-59de-474f-b9db-987476de551f")
							{
								this.consumers = response;
							}
							else if(group.id === "b17c9155-7e6f-4d37-8a86-ea1abb327bb2")
							{
								this.storage = response;
							}
							
							this.total = this.producers.length + this.consumers.length + this.storage.length;
							
							this.labProducers = [...new Set(this.producers.map(element => element.name))];
							this.labConsumers = [...new Set(this.consumers.map(element => element.name))];
							this.labStorages = [...new Set(this.storage.map(element => element.name))];
							
							this.getNumberOfUsers();
							
						}
					 )
					}
				}
			)	
		}
		
		  
	
	
// CONSUMPTION 
		getConsumptionCurrent(){
			this.auth.currentConsumptionSystem().subscribe(
				(response:any)=>{
					this.currentConsumptionSys = response.toFixed(2);
					this.halfDoughnutConsumtionSys(this.currentConsumptionSys);
				}
			)
		}

		
		halfDoughnutConsumtionSys(usage: any){
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
		
		  const chart = new Chart(this.currentConsumptionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
		  });
		}


		getConsumtionPrevMonth(){
			this.auth.prevMonthConsumptionSystem().subscribe(
				(response : any) => {
					this.prevMonthConsumptionSys = response.toFixed(2);
					this.halfDoughnutPrevMonthConsumtionSys(this.prevMonthConsumptionSys);
				}
			)
		}
// prevMonthConsumptionSYS
		halfDoughnutPrevMonthConsumtionSys(usage: any){
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
		
			const chart = new Chart(this.prevMonthConsumptionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
			});
		}

		getConsumtionNextMonth(){
			this.auth.nextMonthConsumtionSystem().subscribe(
				(response : any) => {
					this.nextMonthConsumptionSys = response.toFixed(2);
					this.halfDoughnutNextMonthConsumtionSys(this.nextMonthConsumptionSys);
				}
			)
		}
// prevMonthConsumptionSYS
		halfDoughnutNextMonthConsumtionSys(usage: any){
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
		
			const chart = new Chart(this.nextMonthConsumptionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
			});
		}
// prevMonthEachDevice

		prevMonthEachDevice(){
			this.auth.eachDevicePrevMonthConsumption().subscribe(
				(response : any) => {
					this.prevMonthEachDeviceConsumption = response;
					console.log("PREV EACH DEVICE::: ",response);
				}
			)
		}


// PRODUCTION 
// currentProductionSYS
		prevMonthProductionSystem(){
			this.auth.currentProcustionSystem().subscribe(
				(response : any) => {
					this.prevMonthConsumptionSys = response.toFixed(2);
					this.halfDoughnutPrevMonthProductionSys(this.prevMonthConsumptionSys);
				}
			)
		}
		halfDoughnutPrevMonthProductionSys(usage: any){
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
		
			const chart = new Chart(this.prevMonthProductionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
			});
		}
		
		getProductionCurrent(){
			this.auth.currentProcustionSystem().subscribe(
				(response : any) => {
					this.currentConsumptionSys = response.toFixed(2);
					this.halfDoughnutProductionSys(this.currentProcuctionSys);
				}
			)
		}
		halfDoughnutProductionSys(usage: any){
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
		
			const chart = new Chart(this.currentProductionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
			});
		}	

		nextMonthProductionSystem(){
			this.auth.nextMonthProductionSystem().subscribe(
				(response : any) => {
					this.nextMonthConsumptionSys = response.toFixed(2);
					this.halfDoughnutNextMonthProductionSys(this.prevMonextMonthConsumptionSys);
				}
			)
		}
		halfDoughnutNextMonthProductionSys(usage: any){
			const d = usage;
			const data = {
			labels: ['Energy consumption'],
			datasets: [
				{
				label: 'Energy consumption',
				data: [d, 1000-d],
				
				},
			],
			};
		
			const options = {
				circumference:180,
				rotation:270,
				aspectRation: 2,
				borderColor: 'rgb(59, 193, 74)', // ZELENA
				backgroundColor:'rgba(59, 193, 74,0.4)',
				pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
				borderWidth: 1,
				pointBorderColor:'rgb(59, 193, 74)',
			};
		
			const chart = new Chart(this.nextMonthProductionSYS.nativeElement, {
			type: 'doughnut',
			data: data,
			options: options,
			});
		}



	allDevices(){
		this.auth.AllDevices().subscribe(
			(response : any)=>{
				console.log("all devices: ",response);
			}
		)
	}

	giveMeDeviceByID(id : any){
		this.auth.deviceInfoByID(id).subscribe(
			(response : any) => {
				console.log("dev : ",response);
			}
		)
	}
	
	
	eachDeviceConsumptingPrevMonth(){
		this.auth.eachDevicePrevMonthConsumption().subscribe({
			next: (response : any) => {
				console.log("EEEEEEEE",response);
			},
			error: (err : any) => {

			}})
	}
	eachDeviceConsumptionNextmonth(){
		this.auth.eachDeviceNextMonthConsumption().subscribe({
			next: (response : any) => {
				console.log(response);
			},
			error : (err : any) => {
				
			}
		})
	}
	selectedOption!:string;
		onOptionChange(){
			switch(this.selectedOption){
				case 'option1':
				//	data = data1;
					break;
				case 'option2':
				// data = data2;
					break;
				default:
					
			}
		}
		
			
		selectedGraph = 'current'; // set default graph
		displayGraphConsumption(graph: string) {
 
		this.selectedGraph = graph;
		switch (graph) {
			case 'current':
				this.getConsumptionCurrent();
			
			break;
			case 'prevMonth':
				this.getConsumtionPrevMonth();
			break;
			case 'nextMonth':
				this.getConsumtionNextMonth();
			break;
		}
	}
		selectedGraphEachDevice = 'prev';
		displayGraphConsumptionEachDevice(graph: string){
			this.selectedGraphEachDevice = graph;
			switch(graph){
				case 'prev':
					this.eachDeviceConsumptingPrevMonth();
					break;
				case 'next':
					this.eachDeviceConsumptingPrevMonth();
					break;
			}
		}
}


               

