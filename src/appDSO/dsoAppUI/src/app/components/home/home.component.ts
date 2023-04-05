import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart, elements } from 'chart.js';
import { User } from 'models/User';
import { animation } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
	
	

	constructor(
		private auth : AuthService
	){}
	

	totalUsers!: number;

	User! : User[];

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
	// @ViewChild('myChartProsumers') myChartProsumers!: ElementRef;

	
	
	ngAfterViewInit(): void {
		this.createMeChartForEveryDevice();
		this.giveMeAllUsers();
    	this.createMeChartForEveryDevice();
    	setTimeout(() => {
        	this.giveMeChartForUsers();
    	}, 0);
	}
							
							
	
	
		
	ngOnInit(): void {
		this.getDeviceGroup();
		this.giveMeAllUsers();
		this.createMeChartForEveryDevice();
		
		
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
							this.giveMeAllUsers();
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
				'rgb(250, 166, 77)',
				'rgb(253, 211, 128)',
				'rgb(78, 148, 155)',
				
			],
			hoverOffset: 4
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
		});
	}

	giveMeAllUsers(){
		this.auth.getCoords().subscribe(
			(response:any)=>{
				// ova funkcionalnost ne prikazuje length - u table.component postoji prikaz...
				this.User = response;
				this.totalUsers = this.User.length
				this.giveMeChartForUsers();
				console.log(this.totalUsers);
			}
		)
	}

	giveMeChartForUsers(){
		const tot = this.totalUsers;
		console.log(tot);
		this.chart1 = new Chart(this.myChartUsers.nativeElement, {
			type: 'pie',
			data: {
				labels: ['Users'],
				datasets: [{
				data: [tot, 100-tot],
				backgroundColor: [
					'rgb(241, 143, 1)',
					'rgb(255, 255, 255)'
				],
				borderWidth: 0
				}]
			},
			options: {
				cutout:'0%',
				
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

		
	
		console.log(label);

	const chartData = {
    labels: label,
    datasets: [
        {
            label: 'Producers',
            backgroundColor: "rgb(241, 143, 1)",
            borderColor: "rgb(241, 143, 1)",
            borderWidth: 1,
            data: dataProducers
        },
        {
            label: 'Consumers',
            backgroundColor: "rgb(54, 162, 235)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
            data: dataConsumers
        },
        {
            label: 'Storages',
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
            data: dataStorages
        }
    	]
	};

		this.chart = new Chart(this.myChartForEveryTypeOfDevice.nativeElement, {
			type: 'bar',
			data: chartData,
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
		}

		
}

               

