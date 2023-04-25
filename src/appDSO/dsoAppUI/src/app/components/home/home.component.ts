import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers, eachDevice } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart, elements } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { User } from 'models/User';
import { animation } from '@angular/animations';
import { Root } from 'models/weather';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
	
	
	
	// eachDevicePrev!: eachDevice[];
	// eachDeviceNext!: eachDevice[]
	selectedOption: any;
	
	

	constructor(
		private auth : AuthService
	){}
	

	totalUsers!: number;
	
	weather! : Root;
	User! : User[];
	
	previousMonthLabels: string[] = [];
	everyDayUsagePreviousMonth: any;
	everyDayUsageNextMonth:any;

	currentConsumptionSys!:any;
	prevMonthConsumptionSys!:any;
	nextMonthConsumptionSys!:any;
	prevMonthEachDeviceConsumption!: eachDevice[];

	currentProcuctionSys!:any;
	prevMonthProductionSys!: any;
	prevMonextMonthConsumptionSys!:any;
	
	currentSys!:any;
	previousMonth! : any;
	nextMonth!: any;
	nextMonthLabels:string[] = [];
	nextMonthData: any;
	currentHour!:any;
	hour!:Date;


	today!:Date;
	MonthPrev!:Date;
	MonthNext!:Date;


	selectOption!: string;

	deviceGroup!: deviceGroup[];
	deviceManifaturers!: deviceManifacturers[];
	deviceManifacturersByGroupID!: deviceGroupManifacturers[];
	deviceGroupByGroupID!: deviceGroupManifacturers[]; 

	producers!: deviceGroupManifacturers[];
	consumers! : deviceGroupManifacturers[];
	storage!: deviceGroupManifacturers[]; 

	labProducers!: string[];
	labConsumers!: string[];
	labStorages!:string[];

	total!: number;
	data : any;
	
	chart!: any;
	chart1!: any;
	chart2!: any;
	chart3!: any;
	chart4!: any;
	
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
	
	ngAfterViewInit(): void {
		setTimeout(()=>{
			this.giveMeChartForTemperatureDaily()
		},0);
		setTimeout(() => {
			this.getConsumptionCurrent();
			this.getProductionCurrent();
			this.getConsumtionPrevMonth();
		}, 1000)

		
		
	}
	
	ngOnInit(): void {	
	// consumption 
		this.getConsumptionCurrent();
		this.getConsumtionPrevMonth();
		this.getConsumtionNextMonth();

		this.getProductionCurrent();

		this.allDevices();
		this.getDate();
		this.getDeviceGroup();
		this.prevMonthEachDevice();

	// temperature
		this.giveMeWeather();
		this.giveMeChartForTemperatureDaily();
		

		this.getNumberOfUsers();
		
		// this.createMeChartForEveryDevice();
		
		this.getAllUserInfo();
	}

	dateForWeater:any;
	month:any;
	next:any;
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
				this.giveMeChartForTemperatureDaily();
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
							this.createChartDevices();
							
							 
							this.labProducers = [...new Set(this.producers.map(element => element.name))];
							this.labConsumers = [...new Set(this.consumers.map(element => element.name))];
							this.labStorages = [...new Set(this.storage.map(element => element.name))];
							
							this.createMeChartForEveryDevice();
							this.getNumberOfUsers();
							this.giveMeChartForUsers();
						}
					 )
					}
				}
			)	
		}
		
		  
	createChartDevices(){
		this.chart = new Chart(this.myChart.nativeElement, {
		type: 'doughnut',
		data: {
			labels: ['Prosumer', 'Consumer', 'Storage'],
			datasets: [{
			data: [this.producers.length, this.consumers.length, this.storage.length],
			backgroundColor: [
				'rgba(255, 159, 64, 0.5)',
				'rgba(54, 162, 235, 0.5)',
				'rgba(75, 192, 192, 0.5)'
				
			],
			borderColor:[
				'rgb(255, 159, 64)',
				'rgb(54, 162, 235)',
				'rgb(75, 192, 192)',
			],
			hoverOffset: 4,
			borderWidth: 1,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
		});
	}

	

	giveMeChartForUsers(){
		const tot = this.totalUsers;
		this.chart1 = new Chart(this.myChartUsers.nativeElement, {
			type: 'doughnut',
			data: {
				labels: ['Users'],
				datasets: [{
				data: [this.totalUsers, 100-this.totalUsers],
				backgroundColor: [
					'rgb(241, 143, 1)',
					'rgb(255, 255, 255)'
				],
				borderWidth: 0
				}]
			},
			options: {
				cutout:'60',
				aspectRatio:30,
				responsive: true,
      			maintainAspectRatio: false,
			}
		});
	}

	

	createMeChartForEveryDevice(){
		const dataProducers: number[] = [];
		let label : string[] = this.labProducers.concat(this.labConsumers).concat(this.labStorages);
		
		this.producers.forEach(element => {
		const index = label.indexOf(element.name);
			dataProducers[index] = dataProducers[index] ? dataProducers[index] + 1 : 1;
		});

		const dataConsumers: number[] = [];
		
		this.consumers.forEach(element => {
		const index = label.indexOf(element.name);
			dataConsumers[index] = dataConsumers[index] ? dataConsumers[index] + 1 : 1;
		});

		const dataStorages: number[] = [];
		
		this.storage.forEach(element => {
		const index = label.indexOf(element.name);
			dataStorages[index] = dataStorages[index] ? dataStorages[index] + 1 : 1;
		});

		
	
	

	const chartData = {
    labels: label,
    datasets: [
        {
            label: 'Producers',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            data: dataProducers
        },
        {
            label: 'Consumers',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor:   'rgb(54, 162, 235)',
            borderWidth: 1,
            data: dataConsumers
        },
        {
            label: 'Storages',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            data: dataStorages
        }
    	]
	};

		this.chart = new Chart(this.myChartForEveryTypeOfDevice.nativeElement, {
			type: 'bar',
			data: chartData,
			options: {
				indexAxis: 'y',
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
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
			this.auth.eachDevicePrevMonth().subscribe(
				(response : any) => {
					this.prevMonthEachDeviceConsumption = response;
					console.log("PREV EACH DEVICE::: ",this.prevMonthEachDeviceConsumption);
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
		this.auth.device(id).subscribe(
			(response : any) => {
				console.log("dev : ",response);
			}
		)
	}
		
		Previousbool : boolean = true;
		Nextbool : boolean = false;
		selectedOptionChart:string = 'Previous';
		onOptionSelect(){
			if(this.selectedOptionChart === 'Previous'){
				this.Previousbool = true;
				this.Nextbool = false;
			}else if(this.selectedOptionChart === 'Next'){
				this.Previousbool = false;
				this.Nextbool = true;
			}
		}
			
		
}

               

