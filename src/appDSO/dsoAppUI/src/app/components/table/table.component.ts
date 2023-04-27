import { write, writeXLSX } from 'xlsx';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Device, Info, Root, Root2, User } from 'models/User';
import { AuthService } from 'service/auth.service';
import {PageEvent} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; 
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { PaginatorModule } from 'primeng/paginator';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Chart, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit, AfterViewInit {


  @ViewChild('powerUsageGraph') powerUsageGraph!:ElementRef;
  @ViewChild('prev24DeviceID') prev24DeviceID!:ElementRef;
  @ViewChild('myTable') myTable!: ElementRef;
  @ViewChild('perHourDevice') perHourDevice!:ElementRef;
  @ViewChild('consumptionPrevMonthUSER') consumptionPrevMonthUSER!:ElementRef;
  @ViewChild('consumptionNextMonthUSER') consumptionNextMonthUSER!:ElementRef;
  @ViewChild('productionNextMonthUSER') productionNextMonthUSER!:ElementRef;
  @ViewChild('consumptionPrev7DAYS') consumptionPrev7DAYS!:ElementRef;
  
  chartInstance!: Chart;
  subscription!: Subscription;
  consumptionPrevious7days: any;
  consumptionPrevious24h: any;
  consumptionNext7days: any;
  consumptionNext24h: any;
 
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
// filtriranje
  _searchByName: string = '';
  _searchByCity: string = '';
  _searchByAddress: string = '';
  exportData: any[] = [];

  allUserDevices!: Info[];
  userIDCoords!: any[];
  
// export 
  filtered! : User[];
  activeItem:any;
  exportSelected: boolean = false;

// pagination
  public page = 1;
  public pageSize = 10;
  
  showAllUsersOnMap : boolean = true;
  lengthOfUsers!: number;
  allUsers!: User[];

  // buttons - popUP
  showDevicePage = true;
  showSystemPage = false;
  showMeGeneral = false;


   
  private userCoords!: any[];

  public toggleTable: boolean = false;
  public showDevGraph:boolean = false;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  selected: string = "";
  pageSizeOptions = [10, 25, 50];

  powerUsage!: string;
  deviceGroup!: any[];
  values!:any[];

// device type
  producers!: any[];
  consumers!: any[];
  storage!: any[];

  todayPowerUsageDevice!:any;
  userPopUp!:any;

  // graph-sys
  consumptionPrevMonthUser!:[];
  consumptionNextMonthUser!:[];
  cPrevMonthUser!:string[];
 
  timeStampConsumption =[];
  powerUsageConsumption = [];
 
  timeStrampConsumptionNextMonth = [];
  powerUsageConsumptionNextMonth = [];
  // graoh
  productionNextMonthUser = [];
  productionPrevMonthUser = [];
  timeStrampProductionNextMonth = [];
  powerUsageProductionNextMonth = [];
  
  id!:any;

  constructor(
    private auth: AuthService,
    private table: MatTableModule,
  ){}

  ngAfterViewInit(): void {
    this.showMeUsers(this.page,this.pageSize);
    this.popUp(this.id);
    
    
  }

  ngOnInit(): void {
    this.onInitMap();
    this.showMeUsers(this.page,this.pageSize);
    
    this.showCoordsForEveryUser();
    this.getDeviceGroup();
    this.type();

  }

  onPageChange(event: any) {
    this.page = event.page;
    this.pageSize = event.rows;
    this.showMeUsers(this.page, this.pageSize);
  }

  currentSortOrder1: string = 'asc';
  currentSortOrder2: string = 'asc';
  sortData1(sortBy: string): void {
    this.currentSortOrder1 = this.currentSortOrder1 === 'asc' ? 'desc' : 'asc';
   
    if (sortBy === 'consumption') {
      this.allUsers.sort((a, b) => {
        if (a.consumption < b.consumption) {
          return this.currentSortOrder1 === 'asc' ? -1 : 1;
        } else if (a.consumption > b.consumption) {
          return this.currentSortOrder1 === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
   
  }
  sortData2(sortBy:string){
    this.currentSortOrder2 = this.currentSortOrder2 === 'asc' ? 'desc' : 'asc';
   if(sortBy === 'production'){
      this.allUsers.sort((a, b) => {
        if (a.production < b.production) {
          return this.currentSortOrder2 === 'asc' ? -1 : 1;
        } else if (a.production > b.production) {
          return this.currentSortOrder2 === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
  }

    toggleExportSelected(): void {
      this.exportSelected = !this.exportSelected;
      // console.log(this.exportSelected);
    }
    activeColIndex: number = -1;

    setActiveCol(index: number): void {
      this.activeColIndex = index;
    }
    export(): void {
      if (this.exportSelected) {
        this.exportSelectedData();
      } else {
        this.exportToExcel();
      }
    }

  exportToExcel(): void {
    const worksheet = XLSX.utils.table_to_sheet(document.querySelector('#myTable'));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'table-data.xlsx');
    // console.log(worksheet)
  }

  exportSelectedData():void{
    const selectedRows = this.filtered.filter(user => user.selected);
    const worksheet = XLSX.utils.json_to_sheet(selectedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Data');
  
  
    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'selected-data.xlsx');
  }
 
 
  public showMeUsers(page:any, pageSize:any){ 
    this.auth.getPagination(this.page, this.pageSize).subscribe(
      (response : any)=> {
        this.allUsers = response;
        for(let user of this.allUsers){
          
          this.auth.UserConsumptionSummary(user.id).subscribe({
            next : (response:any) => {
              user.consumption = response.toFixed(2);
            
            },
            error: (err:any)=>{
              user.consumption = 0;
            }
          });
      
      this.auth.UserProductionSummary(user.id).subscribe({
          next : (response : any)=>{
            user.production = response.toFixed(2);
          },
          error : (err : any)=>{
            user.production = 0;
          }
        });
      }
    }
    );
  }
  
  applyFilters(): void {
    this.filtered = this.allUsers.filter((user: User) => {
      const nameMatch = user.firstName.toLowerCase().includes(this._searchByName.toLowerCase());
      const addressMatch = user.address.toLowerCase().includes(this._searchByAddress.toLowerCase());
      return nameMatch && addressMatch;
    });
  }
  
  public onInitMap(){
    this.map = L.map('map').setView([44.0165,21.0069],10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  
  }
 
  public showCoordsForEveryUser(){
    this.showAllUsersOnMap = true;
    this.auth.getCoords().subscribe(
      (response: any) => {
        this.lengthOfUsers = response.length;
        this.userCoords = response;
        this.userCoords.forEach((user) => {
          const matchingUser = this.allUsers.find((us) => us.address === user.address.address);
          if (matchingUser) {
            const firstName = matchingUser.firstName;
            const lastName = matchingUser.lastName;
            const address = matchingUser.address;
            const latlng = L.latLng(JSON.parse(user.coordinates));
            const marker = L.marker(latlng).addTo(this.map);
            marker.bindPopup(`<b>${firstName} ${lastName} <br>${address}`);
            this.markers.push(marker);
          }
        });
      });
      // const GeocoderControl = new Geocoder();
      // GeocoderControl.addTo(this.map);
  }


  public showMeOnMap(id: string) {
    // remove all markers from the map
    for (const mark of this.markers) {
      this.map.removeLayer(mark);
    }

  
    // get the user's coordinates
    this.auth.getCoordsByUserID(id).subscribe(
      (response: any) => {
        const latlng = L.latLng(JSON.parse(response['coordinates']));
  
        // add the user's marker to the map
        const marker = L.marker(latlng).addTo(this.map);
        const user = this.allUsers.find(u => u.id === id);
        marker.bindPopup(`<b>${user?.firstName} ${user?.lastName} <br>${user?.address}`).openPopup();
        this.markers.push(marker);
  
        // zoom the map to the user's marker
        this.map.setView(latlng, 15); // 15 is the zoom level, you can adjust it as needed
      }
    );
     // poziv funkcije za svih uredjaja
     this.showMeDevices(id);
    // // poziv informacija o user-u za pop-up
    this.id = id;
    this.popUp(id);
  }  

  
  numberOfProsumers:number = 0;
  numberOfConsumers:number = 0;
  numberOfStorage:number = 0;
  showMeDevices(id : string){
    this.showDevGraph = !this.showDevGraph;
    this.getDeviceGroup();
    this.toggleTable = true;

    this.auth.getDeviceInfoUserByID(id).subscribe(
      (response : any) => {
        this.allUserDevices = response;
        console.log(this.allUserDevices);
        for(let us of this.allUserDevices){
          this.auth.currentPowerUsageDeviceID(us.deviceId).subscribe(
            (response : any)=>{
              this.todayPowerUsageDevice = (response);
              us.powerUsage = (response).toFixed(2);
            }
          )
        this.auth.getDevicesInfoByID(us.deviceId).subscribe({
          next: (response:any)=>{
            us.typeOfDevice = response.groupName;
            if(response.groupName === "Consumer"){
              this.numberOfConsumers++;
            }else if(response.groupName === "Prosumer"){
              this.numberOfProsumers++;
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
                }
                else if(group.id === "18f30035-59de-474f-b9db-987476de551f")
                {
                  this.consumers = response;
                }
                else if(group.id === "b17c9155-7e6f-4d37-8a86-ea1abb327bb2")
                {
                  this.storage = response;
                }
              }
      )}
          }
        )}
      

  toggleColumn(){
    this.toggleTable = !this.toggleTable;
  }
// pop-up
  openModel(){
    const modelDiv = document.getElementById('myModal');
    const background = document.getElementById('myBack');
    if(modelDiv!=null){
      modelDiv.style.display = 'block';
      background!.style.opacity = '40%';
    }
  }

  closeModel(){
    const modelDiv = document.getElementById('myModal');
    const background = document.getElementById('myBack');
    if(modelDiv!=null){
      modelDiv.style.display = 'none';
      background!.style.opacity = '100%';
    }
  }
  
  showDevices:boolean = false;
  showSystem:boolean = false;
  powerUsagePopUp!: number;
 

  popUp(id: string){
    this.auth.getUserInformation(id).subscribe(
      (response : any) => {
        this.userPopUp = response;
        console.log(this.userPopUp.id);
        
        this.auth.UserConsumptionSummary(this.userPopUp.id).subscribe(
          (response:any) => {
            this.userPopUp.consumption = response.toFixed(2);
          
          });

      this.auth.UserProductionSummary(this.userPopUp.id).subscribe({
        next : (response : any) =>{
          this.userPopUp.production = response.toFixed(2);
         
        },
        error : (err:any)=>{
         this.userPopUp.production = 0;
        }
        
      });

      this.consumptionPrevMonth(this.userPopUp.id);
      this.consumptionNextMonth(this.userPopUp.id);
     

        this.auth.productionNextMonthUser(this.userPopUp.id).subscribe({
          next:(response:any) => {
            this.productionNextMonthUser = response[0]['timestampPowerPairs'];
            this.makeDataGraphMonthProduction(this.productionNextMonthUser);
            setTimeout(
              ()=>{
                this.chartProductionNextMonthChart();
              },1000);
          },
          error : (err : any) => {
            console.log("error procustion next month user");
          }
        })
        
        this.auth.productionPrevMonthUser(this.userPopUp.id).subscribe({
          next: (response : any) => {
            this.productionPrevMonthUser = response[0]['timestampPowerPairs'];
          },
          error: (err : any) => {
            console.log("error production prev month");
          }
        })
     
      }
    );
    this.halfDought();
    
    //this.chartConsumptionPrevMonth();
   }

   consumptionPrevMonth(id : any){
    this.auth.consumptionPrevMonth(id).subscribe(
      {
        next: (response : any) => {
          this.consumptionPrevMonthUser = response[0]['timestampPowerPairs'];
         
         
          for(let i = 0; i < this.consumptionPrevMonthUser.length; i++){
            this.timeStampConsumption.push(this.consumptionPrevMonthUser[i]['timestamp']);
            this.powerUsageConsumption.push(this.consumptionPrevMonthUser[i]['powerUsage']);
          }
         
            this.chartConsumptionPrevMonth();
          
          },
        error: () => {
          console.log("GRESKA.");
        }
      }
    );
   }
   consumptionNextMonth(id : any){
    this.auth.consumptionNextMonth(id).subscribe(
      {
        next: (response:any) => {
          this.consumptionNextMonthUser = response[0]['timestampPowerPairs'];
          this.makeDataGraphMonthConsumption(this.consumptionNextMonthUser);
          setTimeout(
            ()=>{
              this.chartConsumptionNextMonthChart();
            },1000);
         
        },
        error : (err : any) => {
          console.log(err);
        }
      })
   }
  halfDought(){
    const d = this.powerUsagePopUp;
    const data = {
      datasets: [
        {
          label: 'Energy consumption',
          data: [d, 1000-d],
          backgroundColor: ['#FFC107', '#ECEFF1'],
        },
      ],
    };

    const options = {
     circumference:180,
     rotation:270,
     aspectRation: 2
    };

    const chart = new Chart(this.powerUsageGraph.nativeElement, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }
  
  
  isActiveUser = false; 
  isActiveDevice = true;
  isActiveSystem = false;
  toggleActive(button: string) {
    this.isActiveUser = button === 'user';
    this.isActiveDevice = button === 'device';
    this.isActiveSystem = button === 'system';
  }

  graph24prev!:any;
  selectedDevice: any;
  displayGraph(device: any) {
    this.selectedDevice = device;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.subscription = this.auth.devicePrevious24h(this.selectedDevice.deviceId).subscribe(
      (response : any) => {
        this.graph24prev = response;
        console.log(response);
        // this.deviceGraphPrev24(this.graph24prev);
        this.makeDataGraph24(this.graph24prev);
      }
    )
  }

  makeDataGraph24(dataGraph:any){
    
    const list =  Object.keys(dataGraph).map((key) => key.split('T')[1].split('Z')[0]);
    const valuesList = [];

    for (const key in dataGraph) {
      if (dataGraph.hasOwnProperty(key)) {
        valuesList.push(dataGraph[key]);
      }
    }
    this.deviceGraphPrev24(list,valuesList);
  }

  makeDataGraphMonthConsumption(dataGraph : any){
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampConsumptionNextMonth.push(this.consumptionNextMonthUser[i]['timestamp']);
      this.powerUsageConsumptionNextMonth.push(this.consumptionNextMonthUser[i]['powerUsage']);
    }
  }

  makeDataGraphMonthProduction(dataGraph : any){
    console.log(dataGraph);
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampProductionNextMonth.push(this.productionNextMonthUser[i]['timestamp']);
      this.powerUsageProductionNextMonth.push(this.productionNextMonthUser[i]['powerUsage']);
    }
    console.log(this.powerUsageProductionNextMonth);
  }
  timeStrampProductionPrev7days = [];
  powerUsageProductionPrev7days = [];
  makeDataGraphPrev7DaysConsumption(dataGraph : any){
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampProductionPrev7days.push(this.consPrev7Days[i]['timestamp']);
      this.powerUsageProductionPrev7days.push(this.consPrev7Days[i]['powerUsage']);
    }
  }

  deviceGraphPrev24(list:any, valueList:any){
    const data = {
      labels: list,
      datasets: [{
        label: 'Previous 24h',
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
            text: 'Date and Time',
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
            text: 'Power Consuming in (kw/day)',
          },
          ticks: {
            font: {
              size: 14,
            },
          },
        },
      },
    };
    this.chartInstance = new Chart(this.prev24DeviceID.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }

  type(){
    this.auth.groupDevice().subscribe(
      (repsonse : any) => {
        console.log(repsonse);
      }
    )
  }
  extractedDatesPrevMonth!:string[]
  chartConsumptionPrevMonth(){
    for(let i = 0; i < this.timeStampConsumption.length; i++){
      const dateStringList = this.timeStampConsumption.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesPrevMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
      
    }
  
    const data = {
      labels: this.extractedDatesPrevMonth,
      datasets: [{
        label: 'Previous Month',
        data: this.powerUsageConsumption,
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
            text: 'Date ',
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
            text: 'Power Consuming in (kw/day)',
          },
          ticks: {
            font: {
              size: 14,
            },
          },
        },
      },
    };
    const chart = new Chart(this.consumptionPrevMonthUSER.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }

  extractedDatesNextMonth!:string[]
  chartConsumptionNextMonthChart(){
    for(let i = 0; i < this.timeStampConsumption.length; i++){
      const dateStringList = this.timeStampConsumption.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesNextMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
      
    }
  
  
    const data = {
      labels: this.extractedDatesNextMonth,
      datasets: [{
        label: 'Next Month',
        data: this.powerUsageConsumptionNextMonth,
        fill: true,
					borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'
      }]
    }
    const options: ChartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date ',
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
            text: 'Power Consuming in (kw/day)',
          },
          ticks: {
            font: {
              size: 14,
            },
          },
        },
      },
    };
    const chart = new Chart(this.consumptionNextMonthUSER.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }

  extractedDatesNextMonthProduction!:string[]
  chartProductionNextMonthChart(){
    for(let i = 0; i < this.timeStrampProductionNextMonth.length; i++){
      const dateStringList = this.timeStrampProductionNextMonth.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesNextMonthProduction = substrings.map((date: string) => date.substring(0, date.indexOf('T')));
      
    }
    const data = {
      labels: this.extractedDatesNextMonthProduction,
      datasets: [{
        label: 'Next Month',
        data: this.powerUsageConsumptionNextMonth,
        fill: true,
					borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'
      }]
    }
    const options: ChartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date ',
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
            text: 'Power Production in (kw/day)',
          },
          ticks: {
            font: {
              size: 14,
            },
          },
        },
      },
    };
    const chart = new Chart(this.productionNextMonthUSER.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }
consPrev7Days = [];
  consumptionPrev7Days(id : any){
    this.auth.consumptionPrev7days(id).subscribe({
      next:(response : any) => {
        this.consPrev7Days = response[0]['timestampPowerPairs'];
        this.makeDataGraphPrev7DaysConsumption(this.consPrev7Days);
        console.log(this.consPrev7Days);
        this.chartConsumptionPrev7Days();
      },
      error : (err : any) => {
        console.log("error consumptio previous 7 days");
      }
    })
  }
  extractedDatesPrev7Days!:string[]
  chartConsumptionPrev7Days(){
    for(let i = 0; i < this.timeStrampProductionPrev7days.length; i++){
      const dateStringList = this.timeStrampProductionPrev7days.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesPrev7Days = substrings.map(date => date.substring(0, date.indexOf('T')));
      
    }
    console.log(this.extractedDatesPrev7Days);
    console.log(this.powerUsageProductionPrev7days);
    const data = {
      labels: this.extractedDatesPrev7Days,
      datasets: [{
        label: 'Previous 7 days Consumption',
        data: this.powerUsageProductionPrev7days,
        fill: true,
        borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'
       
      }]
    }
      
      const stackedLine = new Chart(this.consumptionPrev7DAYS.nativeElement, {
        type: 'bar',
        data: data,
        
      });
  }
      selectedGraphHistoryConsumption = 'month'; // set default graph
      HistoryConsumption(graph: string) {
      this.selectedGraphHistoryConsumption = graph;
      switch (graph) {
        case 'month':
          this.consumptionPrevMonth(this.id);
        
        break;
        case '7days':
          this.consumptionPrev7Days(this.id);
        break;
        case '24h':
          this.consumptionPrevious24h;
        break;
      }
    }
      selectedGraphFutureConsumption = 'month'; // set default graph
      FutureConsumption(graph: string) {
      this.selectedGraphFutureConsumption = graph;
      switch (graph) {
        case 'month':
          this.consumptionNextMonth(this.id);
        
        break;
        case '7days':
          this.consumptionNext7days;
        break;
        case '24h':
          this.consumptionNext24h;
        break;
      }
    }


}


  



  





