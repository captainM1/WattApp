import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { deviceGroup, deviceGroupManifacturers, deviceManifacturers } from 'models/Devices';
import { AuthService } from 'service/auth.service';
import { Chart, elements } from 'chart.js';
import { User } from 'models/User';

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
	@ViewChild('myChartProsumers') myChartProsumers!: ElementRef;
	@ViewChild('myChartConsumers') myChartConsumers!: ElementRef;
	@ViewChild('myChartStorage') myChartStorage!: ElementRef;
	@ViewChild('myChartForEveryTypeOfDevice') myChartForEveryTypeOfDevice!: ElementRef;
	
	ngAfterViewInit(): void {
		this.giveMeChartForUsers();
		this.createMeChartForEveryDevice();
	}
							
							
	
	
		
	ngOnInit(): void {
		this.getDeviceGroup();
		this.giveMeAllUsers();
		this.createMeChartForEveryDevice();
		// this.giveMeChartForProducers();
		// this.giveMeChartForConsumers();
		// this.giveMeChartForStorages();
	}
	
	// onOptionChange(event: Event){
	// 	this.selectOption = (event.target as HTMLSelectElement).value;
	// 	if (this.selectOption === 'prosumer') {
	// 		this.giveMeChartForProducers();
	// 	  } else if (this.selectOption === 'consumer') {
	// 		this.giveMeChartForConsumers();
	// 	  } else if (this.selectOption === 'storage') {
	// 		this.giveMeChartForStorages();
	// 	}
	// }
	
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
							
							this.labProducers = this.producers.map(element => element.name); 
							this.labConsumers = this.consumers.map(element => element.name);
							this.labStorages = this.storage.map(element => element.name);
							
							// this.giveMeChartForProducers();
							// this.giveMeChartForConsumers();
							// this.giveMeChartForStorages();
							this.createMeChartForEveryDevice();
							
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
			}
		)
	}

	giveMeChartForUsers(){
		this.giveMeAllUsers();
		this.chart1 = new Chart(this.myChartUsers.nativeElement, {
			type: 'doughnut',
			data: {
				labels: ['Users'],
				datasets: [{
				data: [this.totalUsers, 20-this.totalUsers],
				backgroundColor: [
					
					'rgb(241, 143, 1)',
					'rgba(1, 2, 3, 1)'
				],
				borderWidth: 0
				}]
			},
			options: {
				cutout: '50%',
      			responsive: true,
      			maintainAspectRatio: false,
				 
			}
		});
	}

	// giveMeChartForProducers(){
	// 	const data: number[] = []; 
	// 	const labels = this.labProducers;
	// 	this.producers.forEach(element => {
	// 		const index = labels.indexOf(element.name);
	// 		data[index] = data[index] ? data[index] + 1 : 1; 
	// 	});
	// 	this.chart2 = new Chart(this.myChartProsumers.nativeElement, {
	// 	type:'bar',
	// 	data : {
	// 		labels: labels,
	// 	datasets: [{
	// 		label: 'Number of Appliances',
	// 		backgroundColor: "rgb(241, 143, 1)",
    //   		borderColor: "rgb(241, 143, 1)",
    //   		borderWidth: 1,
	// 		data:data}
	// 		]},
	// 		options: {
	// 			scales: {
	// 			  y: {
	// 				beginAtZero: true
	// 			  }
	// 			}
	// 		  }
	// 		})
	// 	}

	// 	giveMeChartForConsumers(){
	// 		const data: number[] = []; 
	// 		const labels = this.labConsumers;
	// 		this.consumers.forEach(element => {
	// 			const index = labels.indexOf(element.name); 
	// 			data[index] = data[index] ? data[index] + 1 : 1; 
	// 		});
	// 		this.chart3 = new Chart(this.myChartConsumers.nativeElement, {
	// 		type:'bar',
	// 		data : {
	// 			labels: labels,
	// 		datasets: [{
	// 			label: 'Number of Appliances',
	// 			backgroundColor: "rgb(241, 143, 1)",
	// 			  borderColor: "rgb(241, 143, 1)",
	// 			  borderWidth: 1,
	// 			data:data}
	// 			]},
	// 			options: {
	// 				scales: {
	// 				  y: {
	// 					beginAtZero: true
	// 				  }
	// 				}
	// 			  }
	// 			})
	// 		}

	// 		giveMeChartForStorages(){
	// 			const data: number[] = []; 
	// 			const labels = this.labStorages;
	// 			console.log(labels)
	// 			this.storage.forEach(element => {
	// 				const index = labels.indexOf(element.name); 
	// 				data[index] = data[index] ? data[index] + 1 : 1; 
	// 			});
				
	// 			this.chart4 = new Chart(this.myChartStorage.nativeElement, {
	// 			type:'bar',
	// 			data : {
	// 				labels: labels,
	// 			datasets: [{
	// 				label: 'Number of Appliances',
	// 				backgroundColor: "rgb(241, 143, 1)",
	// 				  borderColor: "rgb(241, 143, 1)",
	// 				  borderWidth: 1,
	// 				data:data}
	// 				]},
	// 				options: {
	// 					scales: {
	// 					  y: {
	// 						beginAtZero: true
	// 					  }
	// 					}
	// 				  }
	// 				})
	// 			}

	createMeChartForEveryDevice(){
	const dataProducers: number[] = [];
	const labelsP: string[] = this.labProducers;
	this.producers.forEach(element => {
    const index = labelsP.indexOf(element.name);
    dataProducers[index] = dataProducers[index] ? dataProducers[index] + 1 : 1;
	});

	const dataConsumers: number[] = [];
	const labelsC: string[] = this.labConsumers;
	this.consumers.forEach(element => {
    const index = labelsC.indexOf(element.name);
    dataConsumers[index] = dataConsumers[index] ? dataConsumers[index] + 1 : 1;
	});

	const dataStorages: number[] = [];
	const labelsS: string[] = this.labStorages;
	this.storage.forEach(element => {
    const index = labelsS.indexOf(element.name);
    dataStorages[index] = dataStorages[index] ? dataStorages[index] + 1 : 1;
	});
	let label : string[] = this.labProducers.concat(this.labConsumers);
	label.concat(this.labStorages);

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

               

