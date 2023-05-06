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
import { ModalTableComponent } from '../modal-table/modal-table.component';
import { MatDialog } from '@angular/material/dialog';
import * as bootstrap from 'bootstrap';
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
	chartPrev7days: any;
	chartPrevMonth: any;
	constructor(
		private auth : AuthService,
		private spinner: NgxSpinnerService,
		public dialog: MatDialog
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
		this.productionPrev24h();
		this.HistoryConsumption();
	}

	ngAfterViewInit(): void {
		this.giveMeChartForTemperatureDaily();
		setTimeout(()=>{
			this.currentConsumptionDay();
		this.currentProductionDay();
			this.lineChartConsumptionProduction();
		},1000);
		this.getConsumptionCurrent();

		this.getConsumtionPrevMonth();
		this.getConsumtionNextMonth();

		this.getProductionCurrent();
		this.nextMonthProductionSystem();
		this.prevMonthProductionSystem();
		this.selectedGraph = 'current';
		this.previous24GraphConsumption(this.powerUsageListPrev24hConsumption, this.timestampListPrev24hConsumption, this.powerUsageListPrev24hProduction);
		
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
  @ViewChild('previous24ConsumptionGraph') previous24ConsumptionGraph!:ElementRef;
  @ViewChild('consumptionPrev7daysGraph') consumptionPrev7daysGraph!:ElementRef;
  @ViewChild('consumptionPrevMonthGraph') consumptionPrevMonthGraph!:ElementRef;
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
	
	
	openDialog1(){
		const dialogRef = this.dialog.open(ModalTableComponent,{
			width:'200px',
			data:{title: 'Current Consumption', items: this.currentDataC}
		});

		dialogRef.afterClosed().subscribe(
			(result)=>{
				console.log("The dialog was closed");
			}
		)
	}

	openDialog2(): void {
		const dialogRef = this.dialog.open(ModalTableComponent, {
		  width: '250px',
		  data: { title: 'Current Consumption', items: this.currentDataC },
		});
	
		dialogRef.afterClosed().subscribe((result) => {
		  console.log('The dialog was closed');
		});
	  }
	
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
		public text = " more then previous hour";
		currentConsumptionDay(){
			this.spinner.show();
			this.currentConsumptionDayLoader = true;
			this.auth.currentConsumptionDay().subscribe(
				(response:any)=>{
					this.currentDataC = response['timestampPowerPairs'];
					this.timestamps1 = this.currentDataC.map((obj: { timestamp:any[]; }) => obj.timestamp.slice(11, 16));
					this.powerusage1 = this.currentDataC.map((obj: { powerUsage: any[]; }) => obj.powerUsage);
					const length = this.currentDataC.length;
					this.prevHour = response['timestampPowerPairs'][length-2]['powerUsage'].toFixed(2);
					this.currentHour = response['timestampPowerPairs'][length-1]['powerUsage'].toFixed(2);
					this.razlika = (((this.currentHour - this.prevHour)/this.prevHour)*100).toFixed(2);
					this.text = " more then previous hour";
					if(this.razlika < 0){
						this.text = " less then previous hour";
					}
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
		public text1 = " more then previous hour";
		currentProductionDay(){
			this.spinner.show();
			this.currentProductionDayLoader = true;
			this.auth.currentProductionDay().subscribe(
				(response:any)=>{
					this.currentDataP = response['timestampPowerPairs'];
					
					this.timestamps1 = this.currentDataP.map((obj: { timestamp:any[]; }) => obj.timestamp.slice(11, 16));
					this.powerusage1 = this.currentDataP.map((obj: { powerUsage: any[]; }) => obj.powerUsage);
					const length = this.currentDataP.length;
					this.prevHour1 = response['timestampPowerPairs'][length-2]['powerUsage'].toFixed(2);
					this.currentHour1 = response['timestampPowerPairs'][length-1]['powerUsage'].toFixed(2);
					this.razlika1 = (((this.currentHour1 - this.prevHour1)/this.prevHour1)*100).toFixed(2);
					this.text = " more then previous hour";
					if(this.razlika1 < 0){
						this.text = " less then previous hour";
					}
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

		graphProductionConsumption:any;
		lineChartConsumptionProduction(){
			for(let i = 0; i < this.timeStampCurrDayC.length; i++){
				const dateStringList = this.timeStampCurrDayC.toString();
				const substrings = dateStringList.split(',');
				this.stringsCurrDayC = substrings.map(date => date.substring(0, date.indexOf('T')));
			}
			const data1 = this.powerUsageCurrDayC;
			const data2 = this.powerUsageCurrDayP;
			if(data1 && data2){

			
			console.log("DATA1", data1);
			console.log("DATA2", data2);
			
			const data = {
				labels: this.stringsCurrDayC,
				datasets: [
				  {
					label: 'Consumtion',
					data:data1,
					backgroundColor: this.backgroundColorsGraphs[0],
					borderColor: 'rgba(98, 195, 112, 20)',
					borderWidth: 1
				  },
				  {
					label: 'Production',
					data: data2,
					backgroundColor: this.backgroundColorsGraphs[1],
					borderColor: 'rgba(236, 115, 87, 20)',
					borderWidth: 1
				  }
				  
				]
			  };
				this.graphProductionConsumption = new Chart(this.consumptionProduction.nativeElement, {
					type: 'line',
					data: data
				});
			 }
			}
			consumptionPrev24hLoader:boolean = false;
			consumptionPrev24hData!:any;
			chartPrev24h!:any;
			consumptionPrev24h(){
			this.spinner.show();
			this.consumptionPrev24hLoader = true;
			this.auth.consumptionPrev24h().subscribe(
				{
					next:(response:any)=>{
						this.consumptionPrev24hData = response['timestampPowerPairs'];
						this.makeDataConsumptionPrev24h(this.consumptionPrev24hData);
						this.previous24GraphConsumption(this.powerUsageListPrev24hConsumption, this.timestampListPrev24hConsumption, this.powerUsageListPrev24hProduction);
						this.spinner.hide();
						this.consumptionPrev24hLoader = false;
					},
					error:(err : any)=>{
						this.consumptionPrev24hData = 0;
						this.spinner.hide();
						this.consumptionPrev24hLoader = false;
					}
				});
			}
			productionPrev24hLoader:boolean = false;
			productionPrev24hData!:any;
			
			productionPrev24h(){
				this.spinner.show();
				this.productionPrev24hLoader = true;
				this.auth.productionPrev24h().subscribe({
					next:(response:any)=>{
						this.productionPrev24hData = response['timestampPowerPairs'];
						console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDD",this.productionPrev24hData)
						this.makeDataForProductionPrev24h(this.productionPrev24hData);
						
						this.spinner.hide();
						this.productionPrev24hLoader = false;
					},
					error:(err : any) => {
						this.productionPrev24hData = 0;
						this.spinner.hide();
						this.productionPrev24hLoader = false;
					}
				})

			}
			timestampListPrev24hProduction!:any[];
			powerUsageListPrev24hProduction!:any[];
			makeDataForProductionPrev24h(dataGraph : any){
				this.timestampListPrev24hProduction = [];
				this.powerUsageListPrev24hProduction = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrev24hProduction.push(this.productionPrev24hData[i]['timestamp']);
					this.powerUsageListPrev24hProduction.push(this.productionPrev24hData[i]['powerUsage']);
				}
				console.log("PROD",this.powerUsageListPrev24hProduction);
				
			}
			timestampListPrev24hConsumption!:any[];
			powerUsageListPrev24hConsumption!:any[];
			makeDataConsumptionPrev24h(dataGraph:any){
				this.timestampListPrev24hConsumption = [];
				this.powerUsageListPrev24hConsumption = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrev24hConsumption.push(this.consumptionPrev24hData[i]['timestamp']);
					this.powerUsageListPrev24hConsumption.push(this.consumptionPrev24hData[i]['powerUsage']);
				  }
				  
			  }
			  getProduction(){
				if(this.powerUsageListPrev24hProduction != null){
					return this.powerUsageListPrev24hProduction;
				}
				return 0;
			  }

			 
			  previous24GraphConsumption(data1 : any, label : any, data2:any){
				const d = data1;
				const l = label;
				const d1 = data2;
				console.log("D",d1);
				if (this.previous24ConsumptionGraph){
				  if (this.chartPrev24h) {
					this.chartPrev24h.destroy();
				  }
			
				const data = {
				  labels: label,
				  datasets: [{
					label: 'Consumption For The Previous 24h',
					data: data1,
					fill: true,
					borderColor: 'rgb(255, 200, 0)',
					backgroundColor:'rgba(255, 200, 0,0.4)',
					pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(255, 200, 0)'
				  },
				  {
					label: 'Production For The Previous 24h',
					data: this.powerUsageListPrev24hProduction,
					fill: true,
					borderColor: 'rgb(25, 200, 0)',
					backgroundColor:'rgba(25, 200, 0,0.4)',
					pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(255, 200, 0)'
				  }
				]
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
						  size: 10,
						}
					  },
					  ticks: {
						font: {
						  size: 9,
						},
					  },
					},
				  },
				};
				this.chartPrev24h = new Chart(this.previous24ConsumptionGraph.nativeElement, {
				  type: 'line',
				  data: data,
				  options: options,
				});
			  }
			}
			
			  
			consumptionPrev7DaysLoader:boolean = false;
			consumptionPrev7DaysData! : any;
			consumptionPrev7Days(){
				this.spinner.show();
				this.consumptionPrev7DaysLoader = true;
				this.auth.consumptionPrev7Days().subscribe({
					next:(response : any)=>{
						this.consumptionPrev7DaysData = response['timestampPowerPairs'];
						this.makeDataConsumptionPrev7Days(this.consumptionPrev7DaysData);
						this.previous7DaysGraphConsumption(this.powerUsageListPrev7DaysConsumption, this.timestampListPrev7DaysConsumption);
						this.spinner.hide();
						this.consumptionPrev7DaysLoader = false;
					},
					error:(error : any) => {
						this.consumptionPrev7DaysData = 0;
						this.spinner.hide();
						this.consumptionPrev7DaysLoader = false;
					}
				});
			}
			timestampListPrev7DaysConsumption!:any[];
			powerUsageListPrev7DaysConsumption!:any[];
			makeDataConsumptionPrev7Days(dataGraph:any){
				this.timestampListPrev7DaysConsumption = [];
				this.powerUsageListPrev7DaysConsumption = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrev7DaysConsumption.push(this.consumptionPrev7DaysData[i]['timestamp']);
					this.powerUsageListPrev7DaysConsumption.push(this.consumptionPrev7DaysData[i]['powerUsage']);
				  }
			
				
				console.log(this.timestampListPrev7DaysConsumption, this.powerUsageListPrev7DaysConsumption);
				
			  }

			  productionPrev7DaysLoader:boolean = false;
			  productionPrev7DaysData! : any;
			  productionPrev7Days(){
				this.spinner.show();
				this. productionPrev7DaysLoader = true;
				this.auth. productionPrev7Days().subscribe({
					next:(response : any)=>{
						this.productionPrev7DaysData = response['timestampPowerPairs'];
						this.makeDataProductionPrev7Days(this. productionPrev7DaysData);
						// this.previous7DaysGraphConsumption(this.powerUsageListPrev7DaysConsumption, this.timestampListPrev7DaysConsumption);
						this.spinner.hide();
						this.productionPrev7DaysLoader = false;
					},
					error:(error : any) => {
						this.consumptionPrev7DaysData = 0;
						this.spinner.hide();
						this.productionPrev7DaysLoader = false;
					}
				});
			}

			timestampListPrev7DaysProduction!:any[];
			powerUsageListPrev7DaysProduction!:any[];
			makeDataProductionPrev7Days(dataGraph:any){
				this.timestampListPrev7DaysProduction = [];
				this.powerUsageListPrev7DaysProduction = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrev7DaysProduction.push(this.productionPrev7DaysData[i]['timestamp']);
					this.powerUsageListPrev7DaysProduction.push(this.productionPrev7DaysData[i]['powerUsage']);
				  }
			}

			  previous7DaysGraphConsumption(data1 : any, label : any){
				const d = data1;
				const l = label;
				console.log("DATA< LABEL",d,l);
				if (this.consumptionPrev7daysGraph){
				  if (this.chartPrev7days) {
					this.chartPrev7days.destroy();
				  }
			
				const data = {
				  labels: label,
				  datasets: [{
					label: 'Consumption For The Previous 24h',
					data: data1,
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
						  size: 10,
						}
					  },
					  ticks: {
						font: {
						  size: 9,
						},
					  },
					},
				  },
				};
				this.chartPrev7days = new Chart(this.consumptionPrev7daysGraph.nativeElement, {
				  type: 'bar',
				  data: data,
				  options: options,
				});
			  }
			}
			consumptionPreviousMonthData!:any;
			consumptionPreviousMonthLoader:boolean = false;
			consumptionPreviousMonth(){
				this.spinner.show();
				this.consumptionPreviousMonthLoader = true;

				this.auth.consumptionPreviousMonth().subscribe({
					next:(response : any)=>{
						this.consumptionPreviousMonthData = response['timestampPowerPairs'];
						console.log("consumptionPrevMonthLoader",this.consumptionPrevMonthLoader);
						this.makeDataConsumptionPrevMonth(this.consumptionPreviousMonthData);
						this.previousMonthGraphConsumption(this.powerUsageListPrevMonthConsumption, this.timestampListPrevMonthConsumption);
						this.spinner.hide();
						this.consumptionPrevMonthLoader = false;
					},
					error:(error : any) => {
						this.consumptionPreviousMonthData = 0;
						this.spinner.hide();
						this.consumptionPrevMonthLoader = false;
					}
				})
			}
			timestampListPrevMonthConsumption!:any[];
			powerUsageListPrevMonthConsumption!:any[];
			makeDataConsumptionPrevMonth(dataGraph:any){
				this.timestampListPrevMonthConsumption = [];
				this.powerUsageListPrevMonthConsumption = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrevMonthConsumption.push(this.consumptionPreviousMonthData[i]['timestamp']);
					this.powerUsageListPrevMonthConsumption.push(this.consumptionPreviousMonthData[i]['powerUsage']);
				  }
			
			  }

			productionPreviousMonthData!:any;
			productionPreviousMonthLoader:boolean = false;
			productionPreviousMonth(){
				this.spinner.show();
				this.productionPreviousMonthLoader = true;

				this.auth.productionPreviousMonth().subscribe({
					next:(response : any)=>{
						this.productionPreviousMonthData = response['timestampPowerPairs'];
						console.log("productionPrevMonthLoader",this.productionPrevMonthLoader);
						this.makeDataConsumptionPrevMonth(this.productionPreviousMonthData);
						//this.previousMonthGraphConsumption(this.powerUsageListPrevMonthConsumption, this.timestampListPrevMonthConsumption);
						this.spinner.hide();
						this.productionPrevMonthLoader = false;
					},
					error:(error : any) => {
						this.productionPreviousMonthData = 0;
						this.spinner.hide();
						this.productionPrevMonthLoader = false;
					}
				})
			}
			timestampListPrevMonthProduction!:any[];
			powerUsageListPrevMonthProduction!:any[];
			makeDataProductionPrevMonth(dataGraph:any){
				this.timestampListPrevMonthProduction = [];
				this.powerUsageListPrevMonthProduction = [];
				for(let i = 0; i < dataGraph.length; i++){
					this.timestampListPrevMonthProduction.push(this.productionPreviousMonthData[i]['timestamp']);
					this.powerUsageListPrevMonthProduction.push(this.productionPreviousMonthData[i]['powerUsage']);
				  }
			
			  }
			  
			  previousMonthGraphConsumption(data1 : any, label : any){
				const d = data1;
				const l = label;
				console.log("DA",d);
				console.log("l", l);
				if (this.consumptionPrevMonthGraph){
				  if (this.chartPrevMonth) {
					this.chartPrevMonth.destroy();
				  }
			
				const data = {
				  labels: label,
				  datasets: [
					{
					label: 'Consumption For The Previous Month',
					data: data1,
					fill: true,
					borderColor: 'rgb(255, 200, 0)',
					backgroundColor:'rgba(255, 200, 0,0.4)',
					pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(255, 200, 0)'
				  },
				{
					label: 'Consumption For The Previous Month',
					data: data1,
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
						text: 'Time (day and month)',
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
						  size: 10,
						}
					  },
					  ticks: {
						font: {
						  size: 9,
						},
					  },
					},
				  },
				};
				this.chartPrevMonth = new Chart(this.consumptionPrevMonthGraph.nativeElement, {
				  type: 'line',
				  data: data,
				  options: options,
				});
			  }
			}
		
		selectedGraphHistoryConsumption = '24h';
		HistoryConsumption() {
		switch (this.selectedGraphHistoryConsumption) {
			case '24h':
			this.consumptionPrev24h();
			this.productionPrev24h();
			break;
			case '7days':
				this.consumptionPrev7Days();
			break;
			case 'month':
				this.consumptionPreviousMonth();
			break;
		}
	}
	selectedGraphFutureConsumption = '24h';
	FutureConsumption(){
		switch (this.selectedGraphFutureConsumption) {
			case '24h':
			this.consumptionNext24h();
			
			break;
			case '7days':
				this.consumptionNext7Days();
			break;
			case 'month':
				this.consumptionNextMonth();
			break;
		}
	}
	consumptionNext24hLoader:boolean = false;
	consumptionNext24hData!:any;
	consumptionNext24h(){
		this.spinner.show();
		this.consumptionNext24hLoader = true;
		this.auth.consumptionNext24h().subscribe({
			next:(response : any)=>{
				this.consumptionNext24hData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.consumptionNext24hLoader = false;
			},
			error: (err : any) => {
				console.log("this.consumptionNext24hData error");
				this.spinner.hide();
				this.consumptionNext24hLoader = false;
			}
		})
	}
	consumptionNext7DaysLoader = false;
	consumptionNext7DaysData!:any;
	consumptionNext7Days(){
		this.spinner.show();
		this.consumptionNext7DaysLoader = true;
		this.auth.consumptionNext7Days().subscribe({
			next:(response : any)=>{
				this.consumptionNext7DaysData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.consumptionNext7DaysLoader = false;
			},
			error: (err : any) => {
				console.log("this.consumptionNext7DaysData error");
				this.spinner.hide();
				this.consumptionNext7DaysLoader = false;
			}
		})
	}
	ConsumptionNextMonthLoader = false;
	consumptionNextMonthData!:any;
	consumptionNextMonth(){
		this.spinner.show();
		this.ConsumptionNextMonthLoader = true;
		this.auth.consumptionNexxtMonth().subscribe({
			next:(response : any)=>{
				this.consumptionNextMonthData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.ConsumptionNextMonthLoader = false;
			},
			error: (err : any) => {
				console.log("consumptionNextMonth error");
				this.spinner.hide();
				this.ConsumptionNextMonthLoader = false;
			}
		})
	}
	productionNext24hLoader = false;
	productionNext24hData!:any;
	productionNext24h(){
		this.spinner.show();
		this.productionNext24hLoader = true;
		this.auth.productionNext24h().subscribe({
			next:(response : any)=>{
				this.productionNext24hData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.productionNext24hLoader = false;
			},
			error: (err : any) => {
				console.log("productionNext24hData error");
				this.spinner.hide();
				this.productionNext24hLoader = false;
			}
		})
	}
	productionNext7DaysLoader = false;
	productionNext7DaysData!:any;
	productionNext7Days(){
		this.spinner.show();
		this.productionNext7DaysLoader = true;
		this.auth.productionNext7Days().subscribe({
			next:(response : any)=>{
				this.productionNext7DaysData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.productionNext7DaysLoader = false;
			},
			error: (err : any) => {
				console.log("productionNext7Days error");
				this.spinner.hide();
				this.productionNext7DaysLoader = false;
			}
		})
	}
	productionNextMonthLoader = false;
	productionNextMonthData!:any;
	productionNextMonth(){
		this.spinner.show();
		this.productionNextMonthLoader = true;
		this.auth.productionNextMonth().subscribe({
			next:(response : any)=>{
				this.productionNextMonthData = response['timestampPowerPairs'];
				this.spinner.hide();
				this.productionNextMonthLoader = false;
			},
			error: (err : any) => {
				console.log("productionNextMonth error");
				this.spinner.hide();
				this.productionNextMonthLoader = false;
			}
		})
	}

}
	



               

