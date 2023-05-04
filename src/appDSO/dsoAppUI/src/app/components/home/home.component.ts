import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers, deviceTypeInformation, eachDevice } from 'models/Devices';
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
	
	public selectedGraph!:any;
	constructor(
		private auth : AuthService
	){}

	ngOnInit(): void {	
		this.selectedGraph = 'current';
		// temperature
		this.giveMeWeather();
		this.getAllUserInfo();
		this.allDevices();
		this.getDate();
		this.getNumberOfUsers();
		this.getDeviceGroup();
		this.Day();
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
	
	ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

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
  @ViewChild('consumptionProduction') consumptionProduction!:ElementRef;
	
// users
	totalUsers!: number;
	User! : User[];

// devices 
	deviceGroup!: deviceGroup[];
	deviceManifaturers!: deviceManifacturers[];
	deviceManifacturersByGroupID!: deviceGroupManifacturers[];
	deviceGroupByGroupID!: deviceGroupManifacturers[]; 
	deviceTypeINFO!: deviceTypeInformation[];
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
	nextMonthEachDeviceConsumption!: eachDevice[];

// production
	currentProductionSys!:any;
	prevMonthProductionSys!: any;
	nextMonthProductionSys!:any;
	prevMonextMonthConsumptionSys!:any;

// weather
	weather! : Root;
	today!:Date;
	dateForWeater!:any;
	currHour!:number;
	
	MonthPrev!:Date;
	MonthNext!:Date;
	next!:any;
	month!:any;
	
	public currentHour!: any;
	public prevHour!:any;
	public razlika!:any;

	public currentHour1!: any;
	public prevHour1!:any;
	public razlika1!:any;

	public savedC!:any;
	public savedP!:any;
		
	currentDataC!:[];
	currentDataP!:[];
	timestamps1!:any[];
	timestamps2!:any[];
	powerusage1!:any[];
	powerusage2!:any[];

	chartInstance!: Chart;
	subscription!: Subscription;
	
	
	getDate(){
		this.today = new Date();
		this.dateForWeater = this.today.toLocaleString('en-US',{ hour: 'numeric', minute: 'numeric', day:'numeric', month:'numeric', year:'numeric' });
		this.currHour = this.today.getHours();
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
			const d = usage / 1000;
			const backgroundColor = ['#3bc14a', '#2de1fc', '#D00000'];
			let selectColor = '#3bc14a';
			if(d/1000 < 350){
				selectColor = '#3bc14a';
			}else if(d/1000 > 350){
				selectColor = '#2de1fc';
			}else{
				selectColor = '#D00000';
			}
			
			const data = {
			labels:  ['Energy Consumption'],
			datasets: [
				{
				label : 'Energy Consumption',
				data: [d, 1000 -d ],
				backgroundColor: [selectColor, '#ECEFF1'],
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
// PRODUCTION 
// currentProductionSYS
		prevMonthProductionSystem(){
			this.auth.currentProcustionSystem().subscribe(
				(response : any) => {
					this.prevMonthConsumptionSys = response.toFixed(2);
					
					
				}
			)
		}
		halfDoughnutPrevMonthProductionSys(usage: any){
			const d = usage;
			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
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
					this.currentProductionSys = response.toFixed(2);
					//console.log(this.currentProductionSys);
					
				}
			)
		}
		halfDoughnutProductionSys(usage: any){
			const d = usage;
			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
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
				{
					next: (response : any) => {
						this.nextMonthProductionSys = response.toFixed(2);
						//console.log("nextMonthProductionSys:",this.nextMonthProductionSys);
						this.halfDoughnutNextMonthProductionSys(this.nextMonthProductionSys);
					},
					error: (err : any) => {
						this.nextMonthProductionSys = 0;
					}
				}
				
			)
		}
		halfDoughnutNextMonthProductionSys(usage: any){
			const d = usage;
			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
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


	all!: any[];
	allDevices(){
		this.auth.AllDevices().subscribe(
			(response : any)=>{
				this.all = response;
			}
		)
	}

	giveMeDeviceByID(id : any){
		this.auth.deviceInfoByID(id).subscribe(
			(response : any) => {
				// console.log("dev : ",response);
			}
		)
	}
	
	
	eachDeviceConsumptingPrevMonth(){
		this.auth.eachDevicePrevMonthConsumption().subscribe({
			next: (response : any) => {
				this.prevMonthEachDeviceConsumption = response;
				console.log(this.prevMonthEachDeviceConsumption);
	
				this.auth.deviceTypeInfo().subscribe(
					(response : any) => {
						this.deviceTypeINFO = response;
						console.log("Join1,", this.deviceTypeINFO);
						this.join();
					},
					(err : any) => {
						console.error(err);
					}
				);
			},
			error: (err : any) => {
				console.error(err);
			}
		});
	}
	eachDeviceConsumptionNextmonth(){
		this.auth.eachDeviceNextMonthConsumption().subscribe({
			next: (response : any) => {
				this.nextMonthEachDeviceConsumption = response;
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
		
//CONSUMPTION		
		 // set default graph
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

// PRODUCTION
		selectedGraphProduction = 'current'; // set default graph
		displayGraphProduction(graph: string) {
		this.selectedGraphProduction = graph;
		switch (graph) {
			case 'current':
				this.getProductionCurrent();
			break;
			case 'prevMonth':
				this.prevMonthProductionSystem();
			break;
			case 'nextMonth':
				this.nextMonthProductionSystem();
			break;
		}
	}
		selectedGraphEachDeviceProduction = 'prev';
		displayGraphProductionEachDevice(graph: string){
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

		join(){
			console.log("Join2",this.prevMonthEachDeviceConsumption.length);
			console.log("Join1,",this.deviceTypeINFO.length)
			console.log("ALL", this.all);
		}
		
		Day(){
			this.auth.currentConsumptionDay().subscribe(
				(response:any)=>{
					this.currentDataC = response['timestampPowerPairs'];
					this.timestamps1 = this.currentDataC.map((obj: { timestamp:any[]; }) => obj.timestamp.slice(11, 16));
					this.powerusage1 = this.currentDataC.map((obj: { powerUsage: any[]; }) => obj.powerUsage);
					
					this.prevHour = response['timestampPowerPairs'][12]['powerUsage'].toFixed(2);
					this.currentHour = response['timestampPowerPairs'][13]['powerUsage'].toFixed(2);
					this.razlika = (((this.currentHour-this.prevHour)*100)/100).toFixed(2);
				}
			)
				this.auth.currentProductionDay().subscribe(
					(response:any)=>{
						this.currentDataP = response['timestampPowerPairs'];
						this.timestamps1 = this.currentDataP.map((obj: { timestamp: any[]; }) => obj.timestamp.slice(11, 16));
						this.powerusage2 = this.currentDataP.map((obj: { powerUsage: any[]; }) => obj.powerUsage);
	
						this.prevHour1 = response['timestampPowerPairs'][12]['powerUsage'].toFixed(2);
						this.currentHour1 = response['timestampPowerPairs'][13]['powerUsage'].toFixed(2);
						this.razlika1 = (((this.currentHour1-this.prevHour1)*100)/100).toFixed(2);
					}
				)
			
			

			this.auth.savedEnergyConsumption().subscribe(
				(response : any)=>{
					this.savedC = response.toFixed(2);
				}
			)

			this.auth.savedEnergyProduction().subscribe(
				(response : any)=>{
					this.savedP = response.toFixed(2);
				}
			)
			this.lineChartConsumptionProduction();
			
		}

		lineChartConsumptionProduction(){
			//this.Day();
			console.log(this.currentDataC);
			console.log(this.currentDataP)
			const data = {
				labels: ['aaa','aaa'],
				datasets: [
				  {
					label: 'Consumtion',
					data: [10,10,10],
				  },
				  {
					label: 'Production',
					data: [14,15,74],
				  }
				]
			  };
				const stackedLine = new Chart(this.consumptionProduction.nativeElement, {
					type: 'line',
					data: data
					
				});
			 }

		
}


               

