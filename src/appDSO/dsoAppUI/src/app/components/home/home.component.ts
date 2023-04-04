import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{
	

	constructor(
		private auth : AuthService
	){}
	

	totalUsers: any;

	deviceGroup!: deviceGroup[];
	deviceManifaturers!: deviceManifacturers[];
	deviceManifacturersByGroupID!: deviceGroupManifacturers[];
	deviceGroupByGroupID!: deviceGroupManifacturers[]; 

	producers!: deviceGroupManifacturers[];
	consumers! : deviceGroupManifacturers[];
	storage!: deviceGroupManifacturers[]; 

	total!: number;
	data : any;
	chart: any;
	chart1: any;
	
	@ViewChild('myChart') myChart!: ElementRef;
	@ViewChild('myChartUsers') myChartUsers!:ElementRef;
	ngAfterViewInit(): void {
		
	}
	
	
		
	ngOnInit(): void {
		this.getDeviceGroup();
		this.createChartDevices();
		this.giveMeAllUsers();
		  
	}

	getDeviceGroup(){
		this.auth.getDeviceGroup().subscribe(
			(response : any)=>{
				this.deviceGroup = response;
				console.log(this.deviceGroup);
				for(let group of this.deviceGroup){
					 this.auth.getDeviceGroupID(group.id).subscribe(
						(response:any)=>{
							if(group.id === "77cbc929-1cf2-4750-900a-164de4abe28b")
							{
								this.producers = response;
								console.log("Producers:",this.producers);
								
							}else if(group.id === "18f30035-59de-474f-b9db-987476de551f")
							{
								this.consumers = response;
								console.log("Consumers: ", this.consumers);
							}
							else if(group.id === "b17c9155-7e6f-4d37-8a86-ea1abb327bb2")
							{
								this.storage = response;
								console.log("Storage : ", this.storage)
							}
							this.total = this.producers.length + this.consumers.length + this.storage.length;
							this.createChartDevices();
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
				'rgb(241, 143, 1)',
				'rgb(218, 44, 56)',
				'rgb(0, 191, 178)'
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
				
				this.totalUsers = response.length;
				console.log("USRE:",this.totalUsers);
				console.log("TOTAL",response['length']);
				console.log("P_{",response);
				
			}
		)
	}

	giveMeChartForUsers(){
		this.chart1 = new Chart(this.myChartUsers.nativeElement, {
			type: 'doughnut',
			data: {
				labels: ['allUsers'],
				datasets: [{
				data: [this.totalUsers],
				backgroundColor: [
					'rgb(241, 143, 1)',
				],
				hoverOffset: 4
				}]
			},
			options: {
				responsive: true,
    			maintainAspectRatio: false,
    			circumference: Math.PI,
    			rotation: -Math.PI
			}
			});
		
	}
}

               

