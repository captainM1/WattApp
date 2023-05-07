import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers, deviceTypeInformation, eachDevice } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart, elements } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { User } from 'models/User';
import { animation } from '@angular/animations';
import { Root } from 'models/weather';
import { FormsModule } from '@angular/forms';
import { Subscription, map, timer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
// loader
	weatherLoader!:boolean;
	public selectedGraph!:any;
	backgroundColorsGraphs =  ['#62C370', '#EC7357', '#F42C04'];
	currentDate: any;
	summarySavedEnergy: any;
	showProdPrevious24h!: boolean;
	constructor(
		private auth : AuthService,
		private spinner: NgxSpinnerService
	){}

	ngOnInit(): void {	
		
		// temperature
		this.giveMeWeather();
		this.getAllUserInfo();
		this.allDevices();
		this.getDate();
		this.getNumberOfUsers();
		this.getDeviceGroup();
		this.currentConsumptionDay();
		this.currentProductionDay();
		this.openModel();
		this.closeModel();
		
	}

	ngAfterViewInit(): void {
		this.giveMeChartForTemperatureDaily();
		this.lineChartConsumptionProduction();
		this.getConsumptionCurrent();

		this.getConsumtionPrevMonth();
		this.getConsumtionNextMonth();

		this.getProductionCurrent();
		this.nextMonthProductionSystem();
		this.prevMonthProductionSystem();
		this.selectedGraph = 'current';
		
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
	public currentConsumptionSys!:any;
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
		this.currentDate = timer(0,1000).pipe(
			map(()=>{
			  return new Date();
			})
		  )
	}
//  --- weater ---	
	giveMeWeather(){
		this.spinner.show();
		this.weatherLoader = true;
		this.auth.getWeather().subscribe(
			(response :any)=>{
				this.weather = response;
				this.spinner.hide();
				this.weatherLoader = false;
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
		consumptionCurrentLoader:boolean = false;
		getConsumptionCurrent(){
			this.spinner.show();
			this.consumptionCurrentLoader = true;
			this.auth.currentConsumptionSystem().subscribe(
				{
					next:(response:any)=>{
						
						this.currentConsumptionSys = (response).toFixed(2);
						this.currentConsumptionDay();
						this.halfDoughnutConsumtionSys(this.currentConsumptionSys);
						this.spinner.hide();
						this.consumptionCurrentLoader = false;
					},
					error:(error:any)=>{
						this.spinner.hide();
						this.consumptionCurrentLoader = false;
					}
				}
			)
		}

		
		halfDoughnutConsumtionSys(usage: any){
		  const d = usage;
		  console.log("USAGE - consumption",usage);
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}
		  const data = {
			labels: ['Energy consumption'],
			datasets: [
			  {
				label: 'Energy consumption',
				data: [d, 1000-d],
				backgroundColor: [selectColor, '#ECEFF1'],
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

		consumptionPrevMonthLoader:boolean = false;;
		getConsumtionPrevMonth(){
			this.spinner.show();
			this.consumptionPrevMonthLoader = true;
			this.auth.prevMonthConsumptionSystem().subscribe(
				
				(response : any) => {
					
					this.prevMonthConsumptionSys = (response/1000).toFixed(2);
					this.halfDoughnutPrevMonthConsumtionSys(this.prevMonthConsumptionSys);
					this.spinner.hide();
					this.consumptionPrevMonthLoader = false;
				}
			)
		}
// prevMonthConsumptionSYS
		halfDoughnutPrevMonthConsumtionSys(usage: any){
			const d = usage;
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}
			
			const data = {
			labels:  ['Energy Consumption'],
			datasets: [
				{
				label : 'Energy Consumption',
				data: [d, 1000 - d ],
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
		consumptionNextMonthLoader:boolean = false;
		getConsumtionNextMonth(){
			this.spinner.show();
			this.consumptionNextMonthLoader = true;
			this.auth.nextMonthConsumtionSystem().subscribe(
				(response : any) => {
					this.nextMonthConsumptionSys = (response/1000).toFixed(2);
					this.halfDoughnutNextMonthConsumtionSys(this.nextMonthConsumptionSys);
					this.spinner.hide();
					this.consumptionNextMonthLoader = false;
				}
			)
		}
// prevMonthConsumptionSYS
		halfDoughnutNextMonthConsumtionSys(usage: any){
			const d = usage;
		  	
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}
			
			const data = {
			labels: ['Energy consumption'],
			datasets: [
				{
				label: 'Energy consumption',
				data: [d, 1000-d],
				backgroundColor: [selectColor, '#ECEFF1'],
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
		productionPrevMonthLoader:boolean = false;
		prevMonthProductionSystem(){
			this.spinner.show();
			this.productionPrevMonthLoader = true;
			this.auth.currentProcustionSystem().subscribe({
				next:(response : any) => {
					this.prevMonthConsumptionSys = (response/1000).toFixed(2);
					this.spinner.hide();
					this.productionPrevMonthLoader = false;
				},
				error: (error : any) => {
					this.prevMonthProductionSys = 0;
					this.spinner.hide();
					this.productionPrevMonthLoader = false;
				}
			}
			)
		}
		halfDoughnutPrevMonthProductionSys(usage: any){
			const d = usage;
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}
			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
				data: [d, 1000-d],
				backgroundColor: [selectColor, '#ECEFF1'],
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
		productionCurrentLoader:boolean = false;
		getProductionCurrent(){
			this.spinner.show();
			this.productionCurrentLoader = true;
			this.auth.currentProcustionSystem().subscribe(
				{
					next:(response : any) => {
						this.currentProductionSys = response.toFixed(2);
						this.halfDoughnutProductionSys(this.currentProductionSys);
						this.spinner.hide();
						this.productionCurrentLoader = false;
					},
					error:(err : any) => {
						this.currentProductionSys = 0;
						this.spinner.hide();
						this.productionCurrentLoader = false;
					}
				}
			)
		}
		halfDoughnutProductionSys(usage: any){
			const d = usage;
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}

			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
				data: [d, 1000-d],
				backgroundColor: [selectColor, '#ECEFF1'],
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
		nextMonthProductionLoader: boolean =false;
		nextMonthProductionSystem(){
			this.spinner.show();
			this.nextMonthProductionLoader = true;
			this.auth.nextMonthProductionSystem().subscribe(
				{
					next: (response : any) => {
						this.nextMonthProductionSys = response.toFixed(2);
						this.halfDoughnutNextMonthProductionSys(this.nextMonthProductionSys);
						this.spinner.hide();
						this.nextMonthProductionLoader = false;
					},
					error: (err : any) => {
						this.nextMonthProductionSys = 0;
						this.spinner.hide();
						this.nextMonthProductionLoader = false;
					}
				}
				
			)
		}
		halfDoughnutNextMonthProductionSys(usage: any){
			const d = usage;
			let selectColor = this.backgroundColorsGraphs[0];
			if(d < 350){
				selectColor = this.backgroundColorsGraphs[0];
			}else if(d > 350 && d < 700){
				selectColor = this.backgroundColorsGraphs[1];
			}else if(d > 700) {
				selectColor = this.backgroundColorsGraphs[2];
			}
			const data = {
			labels: ['Energy production'],
			datasets: [
				{
				label: 'Energy production',
				data: [d, 1000-d],
				backgroundColor: [selectColor, '#ECEFF1'],
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
		timeStampCurrDayC = [];
		powerUsageCurrDayC = [];
		stringsCurrDayC!:string[];
		currentConsumptionDayLoader:boolean = false;

		currentConsumptionDay(){
			this.spinner.show();
			this.currentConsumptionDayLoader = true;
			this.auth.currentConsumptionDay().subscribe(
				(response:any)=>{
					this.currentDataC = response['timestampPowerPairs'];
					
					this.timestamps1 = this.currentDataC.map((obj: { timestamp:any[]; }) => obj.timestamp.slice(11, 16));
					this.powerusage1 = this.currentDataC.map((obj: { powerUsage: any[]; }) => obj.powerUsage);
					
					this.prevHour = response['timestampPowerPairs'][12]['powerUsage'].toFixed(2);
					this.currentHour = response['timestampPowerPairs'][13]['powerUsage'].toFixed(2);
					this.razlika = (((this.currentHour - this.prevHour)/this.prevHour)*100).toFixed(2);
					this.makeDataForConsumptionDay(this.currentDataC);
					this.spinner.hide();
					this.currentConsumptionDayLoader = false;
				}
			)
		}
		timeStampCurrDayP = [];
		powerUsageCurrDayP = [];
		stringsCurrDayP!:string[];
		currentProductionDayLoader : boolean = false;
		currentProductionDay(){
			this.spinner.show();
			this.currentProductionDayLoader = true;
			this.auth.currentProductionDay().subscribe(
				(response:any)=>{
					this.currentDataP = response['timestampPowerPairs'];
					
					this.timestamps2 = this.currentDataP.map((obj: { timestamp: any[]; }) => obj.timestamp.slice(11, 16));
					this.powerusage2 = this.currentDataP.map((obj: { powerUsage: any[]; }) => obj.powerUsage);

					this.prevHour1 = response['timestampPowerPairs'][12]['powerUsage'].toFixed(2);
					this.currentHour1 = response['timestampPowerPairs'][13]['powerUsage'].toFixed(2);
					this.razlika1 = (((this.currentHour1 - this.prevHour1)/this.prevHour1)*100).toFixed(2);
					this.makeDataForProductionDay(this.currentDataP);
					this.spinner.hide();
					this.currentProductionDayLoader = false;
				}
			)	
		}

		makeDataForConsumptionDay(dataGraph : any){
			for(let i = 0; i < dataGraph.length; i++){
				this.timeStampCurrDayC.push(this.currentDataC[i]['timestamp']);
				this.powerUsageCurrDayC.push(this.currentDataC[i]['powerUsage']);
			  }
			for(let i = 0; i < this.timeStampCurrDayP.length; i++){
				const dateStringList = this.timeStampCurrDayC.toString();
				const substrings = dateStringList.split(',');
				this.stringsCurrDayC = substrings.map(date => date.substring(0, date.indexOf('T')));
			  }
		}
		makeDataForProductionDay(dataGraph:any){
			for(let i = 0; i < dataGraph.length; i++){
				this.timeStampCurrDayP.push(this.currentDataP[i]['timestamp']);
				this.powerUsageCurrDayP.push(this.currentDataP[i]['powerUsage']);
			  }
			
		}

		
		savedEnergy(){
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
			this.summarySavedEnergy = this.savedC + this.savedP;
		}

		lineChartConsumptionProduction(){
			
			const data = {
				labels: this.stringsCurrDayC,
				datasets: [
				  {
					label: 'Consumtion',
					data:this.powerUsageCurrDayC,
					backgroundColor: this.backgroundColorsGraphs[0],
					borderColor: 'rgba(98, 195, 112, 20)',
					borderWidth: 1
				  },
				  {
					label: 'Production',
					data: this.powerUsageCurrDayP,
					backgroundColor: this.backgroundColorsGraphs[1],
					borderColor: 'rgba(236, 115, 87, 20)',
					borderWidth: 1
				  }
				]
			  };
				const stackedLine = new Chart(this.consumptionProduction.nativeElement, {
					type: 'line',
					data: data
				});
			 }

			 openModel() {
				const modal = document.getElementById("myPopup");
				if(modal){
				modal.style.display = "block";
				}
			  }
			  
			  closeModel() {
				const modal = document.getElementById("myPopup");
				if(modal){
				modal.style.display = "none";
				}
			  }
}


               

