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
import { canvas } from 'chart.js/dist/helpers/helpers.canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxUiLoaderModule,NgxUiLoaderHttpModule, NgxUiLoaderService } from 'ngx-ui-loader';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {


  @ViewChild('powerUsageGraph') powerUsageGraph!:ElementRef;
  @ViewChild('prev24DeviceID') prev24DeviceID!:ElementRef;
  
  @ViewChild('myTable') myTable!: ElementRef;
  @ViewChild('perHourDevice') perHourDevice!:ElementRef;
 
  @ViewChild('consumptionPrevMonthGraph') consumptionPrevMonthGraph!:ElementRef;
  @ViewChild('consumptionNextMonthGraph') consumptionNextMonthGraph!:ElementRef;
  
  @ViewChild('consumptionPrev7DAYS') consumptionPrev7DAYS!:ElementRef;
  @ViewChild('consumptionNext7daysGraph') consumptionNext7daysGraph!:ElementRef;
  @ViewChild('previous24ConsumptionGraph') previous24ConsumptionGraph!:ElementRef;
  @ViewChild('next24ConsumptionGraph') next24ConsumptionGraph!:ElementRef;
  @ViewChild('productionNextMonthUSER') productionNextMonthUSER!:ElementRef;
  @ViewChild('previous24ProductionGraph') previous24ProductionGraph!:ElementRef;
  @ViewChild('productionPrevMonthGraph') productionPrevMonthGraph!:ElementRef;
  @ViewChild('productionPrev7daysGraph') productionPrev7daysGraph!:ElementRef;
  @ViewChild('next24ProductionGraph') next24ProductionGraph!:ElementRef;
  @ViewChild('productionNext7daysGraph')productionNext7daysGraph!:ElementRef;
  @ViewChild('productionNextMonthGraph') productionNextMonthGraph!:ElementRef;
  
  chartInstance!: Chart;
  subscription!: Subscription;
 
 
  consumptionNext7days: any;
 
  timestampListPrev24h!:any[];
  powerUsageListPrev24h!: any[];
  chartPrev24h: any;
  chartNext24h: any;
  graph24next: any;
 
  graph = 'month';
 
  
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
  showMeConsumptionProduction = false;
  showMeConsumption = true;
  showMeProduction = false;


   
  private userCoords!: any[];

  public toggleTable: boolean = false;
  public showDevGraph:boolean = true;

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

  timeStrampProductionPrev7days = [];
  powerUsageProductionPrev7days = [];

  timestampListNext24h!:any[];
  powerUsageListNext24h!:any[];
  // graoh
  productionNextMonthUser = [];
  productionPrevMonthUser = [];

  timeStrampProductionNextMonth = [];
  powerUsageProductionNextMonth = [];

  timestampListProductionPrev24h!:any[];
  powerUsageListProductionPrev24h!:any[];
  
  graphProduction24prev!:any;
  chartProductionPrev24!:any;
    
  timestampListProductionNext24h!:any[];
  powerUsageListProductionNext24h!:any[];
  graphProduction24next!:any;
  
  id!:any;

  selectedDevice!: Device;
  device24h!:any[];
  valueDevice24h!:any[];

  constructor(
    private auth: AuthService,
    private table: MatTableModule,
    private spinner: NgxSpinnerService,
    private loader : NgxUiLoaderService
  ){}

  ngAfterViewInit(): void {
    this.showMeUsers(this.page,this.pageSize);
    this.popUp(this.id);
    this.displayGraph(this.selectedDevice);
    
  }
  selectedGraphHistoryConsumption = '24h';
  ngOnChanges(changes: SimpleChanges) {
    
    if (changes) {
      const currentValue = changes.toString();
      this.HistoryConsumption();
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    this.onInitMap();
    this.showMeUsers(this.page,this.pageSize);
    
    this.showCoordsForEveryUser();
    this.getDeviceGroup();
   
    this.HistoryConsumption();
    this.HistoryProduction(this.graph);
    this.FutureConsumption(this.graph);
    this.FutureProduction(this.graph);


  }

  onPageChange(event: any) {
    this.page = event.page;
    this.pageSize = event.rows;
    this.showMeUsers(this.page, this.pageSize);
  }

  currentSortOrder1: string = 'asc';
  currentSortOrder2: string = 'asc';
  consumptionSortedUsers!: User[];
  productionSortedUsers!:User[];
  sortData1(sortBy: string): void {
    console.log("sor", sortBy);
    console.log("curre", this.currentSortOrder1);
    this.currentSortOrder1 = this.currentSortOrder1 === 'asc' ? 'desc' : 'asc';
    if (sortBy === 'consumption') {
      this.consumptionSortedUsers = this.allUsers.slice(); 
      this.consumptionSortedUsers.sort((a, b) => {
        console.log(a.consumption, b.consumption);
        if (a.consumption < b.consumption) {
          return this.currentSortOrder1 === 'asc' ? -1 : 1;
        } else if (a.consumption > b.consumption) {
          return this.currentSortOrder1 === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      this.allUsers = this.consumptionSortedUsers;
    }
  }
  sortData2(sortBy: string): void {
    console.log(this.allUsers);
    this.currentSortOrder2 = this.currentSortOrder2 === 'asc' ? 'desc' : 'asc';
  
    if (sortBy === 'production') {
      this.productionSortedUsers = this.allUsers.slice(); // make a copy of allUsers
      this.productionSortedUsers.sort((a, b) => {
        if (a.production < b.production) {
          return this.currentSortOrder2 === 'asc' ? -1 : 1;
        } else if (a.production > b.production) {
          return this.currentSortOrder2 === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      this.allUsers = this.productionSortedUsers;
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
  devices!:Info;
  
  showMeDevices(id : string){
   
    this.showDevGraph = !this.showDevGraph;
    this.getDeviceGroup();
    this.toggleTable = true;
    
    
    this.auth.getDeviceInfoUserByID(id).subscribe(
      (response : any) => {
        this.allUserDevices = response;
        
        for(let us of this.allUserDevices){
          this.auth.currentPowerUsageDeviceID(us.deviceId).subscribe(
            {
              next:(response : any)=>{
                this.todayPowerUsageDevice = (response);
                us.powerusage = response.toFixed(2);
              },
              error:(error : any)=>{
                us.powerusage = "Device is turned off";
              }
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

      // this.consumptionPrevMonth(this.userPopUp.id);
      // this.consumptionNextMonth(this.userPopUp.id);
     

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
  
  isActiveProsumer = false;
  isActioveConsumer = true;
  
  toggleActiveCP(button: string) {
    this.isActiveProsumer = button === 'prosumer';
    this.isActioveConsumer = button === 'consumer';
  }
  
  toggleActive(button: string) {
    this.isActiveUser = button === 'user';
    this.isActiveDevice = button === 'device';
    this.isActiveSystem = button === 'system';
  }

  graph24prev!:any[];
  selectDevice = false;
  displayGraph(device: Device) {
    this.selectDevice = true;
    
    this.selectedDevice = device;
    console.log(this.selectedDevice);
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
   this.auth.devicePrevious24h(this.selectedDevice.deviceId).subscribe(
      (response : any) => {
        this.graph24prev = response['timestampPowerPairs'];
        console.log("res", response['timestampPowerPairs']);
        this.makeDataGraph24(this.graph24prev);
        this.deviceGraphPrev24();
      }
    )
  }
  
  timeStampDevice24h!:any[];
  powerUsageDevice24h!:any[];
  makeDataGraph24(dataGraph:any){
    this.timeStampDevice24h = [];
    this.powerUsageDevice24h = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStampDevice24h.push(this.graph24prev[i]['timestamp']);
      this.powerUsageDevice24h.push(this.graph24prev[i]['powerUsage']);
    }
    

    
  }
  extractedDatesDevice24h!:string[];
  deviceGraphPrev24(){
    this.extractedDatesDevice24h = []; 
    for(let i = 0; i < this.timeStampDevice24h.length; i++){
      this.extractedDatesDevice24h.push(this.timeStampDevice24h[i].split("T")[1].split(":00Z")[0]);

    }
    if(this.prev24DeviceID){
      if(this.chartInstance){
        this.chartInstance.destroy();
      }
    
    const data = {
      labels: this.extractedDatesDevice24h,
      datasets: [{
        label: 'Previous 12h',
        data: this.powerUsageDevice24h,
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
}
  consumptionNextMonth(id : any){
    this.auth.consumptionNextMonth(id).subscribe(
      {
        next: (response:any) => {
          this.consumptionNextMonthUser = response[0]['timestampPowerPairs'];
          this.makeDataGraphMonthConsumptionNextMonth(this.consumptionNextMonthUser);
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

  makeDataGraphMonthConsumptionNextMonth(dataGraph : any){
    this.timeStrampConsumptionNextMonth = [];
    this.powerUsageConsumptionNextMonth = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampConsumptionNextMonth.push(this.consumptionNextMonthUser[i]['timestamp']);
      this.powerUsageConsumptionNextMonth.push(this.consumptionNextMonthUser[i]['powerUsage']);
    }
    
  }

  makeDataGraphMonthProduction(dataGraph : any){
   this.timeStrampProductionNextMonth = [];
   this.powerUsageProductionNextMonth = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampProductionNextMonth.push(this.productionNextMonthUser[i]['timestamp']);
      this.powerUsageProductionNextMonth.push(this.productionNextMonthUser[i]['powerUsage']);
    }
  }
  
  consumptionPrevMonth(id : any){
    this.auth.consumptionPrevMonth(id).subscribe(
      {
        next: (response : any) => {
          this.consumptionPrevMonthUser = response[0]['timestampPowerPairs'];
          this.makeDataForConsumptionPrevMonth(this.consumptionPrevMonthUser);
          this.chartConsumptionPrevMonth();
          
          },
        error: () => {
          console.log("error consumption prev month");
        }
      }
    );
   }
  
  timeStampConsumptionPrevMonth!:any[];
  powerUsageConsumptionPrevMonth!:any[];
  makeDataForConsumptionPrevMonth(dataGraph : any){
    this.timeStampConsumptionPrevMonth = [];
    this.powerUsageConsumptionPrevMonth = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStampConsumptionPrevMonth.push(this.consumptionPrevMonthUser[i]['timestamp']);
      this.powerUsageConsumptionPrevMonth.push(this.consumptionPrevMonthUser[i]['powerUsage']);
    }
    
  }

  extractedDatesConsumptionPrevMonth!:string[]
  graphConsumptionPrevMonth!:any;
  chartConsumptionPrevMonth(){
    for(let i = 0; i < this.timeStampConsumptionPrevMonth.length; i++){
      const dateStringList = this.timeStampConsumptionPrevMonth.toString();
      const substrings = dateStringList.split(',');
      this.extractedDatesConsumptionPrevMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
    }
    
    if (this.consumptionPrevMonthGraph){
      if (this.graphConsumptionPrevMonth) {
        this.graphConsumptionPrevMonth.destroy();
      }
   const data = {
      labels: this.extractedDatesConsumptionPrevMonth,
      datasets: [{
        label: 'Previous Month',
        data: this.powerUsageConsumptionPrevMonth,
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
    this.graphConsumptionPrevMonth = new Chart(this.consumptionPrevMonthGraph.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }
}

  extractedDatesNextMonth!:string[];
  chartConsumptionNextMonth!:any;
  chartConsumptionNextMonthChart(){
    for(let i = 0; i < this.timeStampConsumption.length; i++){
      const dateStringList = this.timeStampConsumption.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesNextMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
      
    }

  if(this.consumptionNextMonthGraph){
    if(this.chartConsumptionNextMonth){
        this.chartConsumptionNextMonth.destroy();
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
    this.chartConsumptionNextMonth = new Chart(this.consumptionNextMonthGraph.nativeElement, {
      type: 'line',
      data: data,
      options: options,
    });
  }
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

  timeStrampConsumptionPrev7days = [];
  powerUsageConsumptionPrev7days = [];
  makeDataGraphPrev7DaysConsumption(dataGraph : any){
    this.timeStrampConsumptionPrev7days = [];
    this.powerUsageConsumptionPrev7days = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampConsumptionPrev7days.push(this.consPrev7Days[i]['timestamp']);
      this.powerUsageConsumptionPrev7days.push(this.consPrev7Days[i]['powerUsage']);
    }
  }
consPrev7Days = [];
  consumptionPrev7Days(id : any){
    this.auth.consumptionPrev7days(id).subscribe({
      next:(response : any) => {
        this.consPrev7Days = response[0]['timestampPowerPairs'];
        this.makeDataGraphPrev7DaysConsumption(this.consPrev7Days);
        this.chartConsumptionPrev7Days();
      },
      error : (err : any) => {
        console.log("error consumptio previous 7 days");
      }
    })
  }
  
  chartPrev7days:any;
  extractedDatesPrev7Days!:string[]
  chartConsumptionPrev7Days(){
    
    for(let i = 0; i < this.timeStrampConsumptionPrev7days.length; i++){
      const dateStringList = this.timeStrampConsumptionPrev7days.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesPrev7Days = substrings.map(date => date.substring(0, date.indexOf('T')));
    
    }

    console.log("OVO MI",this.extractedDatesPrev7Days);
    console.log("O", this.powerUsageConsumptionPrev7days)
    if (this.consumptionPrev7DAYS){

      if (this.chartPrev7days) {
        this.chartPrev7days.destroy();
      }

    const data = {
      labels: this.extractedDatesPrev7Days,
      datasets: [{
        label: 'Consumption For The Previous 7 days',
        data: this.powerUsageConsumptionPrev7days,
        fill: true,
        borderColor: 'rgb(255, 200, 0)',
        backgroundColor:'rgba(255, 200, 0,0.4)',
        pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
        borderWidth: 1,
        pointBorderColor:'rgb(255, 200, 0)'

      }]
    }

      this.chartPrev7days= new Chart(this.consumptionPrev7DAYS.nativeElement, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Power Consumption (kW)',
                font: {
                  size: 9,
                },
              }
            }
          }
        }
      });
  }
  }
  consNext7Days = [];
  chartNext7days!:any;
  consumptionNext7Days(id : any){
    this.auth.getConsumptionNext7days(id).subscribe({
      next:(response : any) => {
        this.consNext7Days = response[0]['timestampPowerPairs'];
        this.makeDataGraphNext7DaysConsumption(this.consNext7Days);
        this.chartConsumptionNext7Days();
      },
      error : (err : any) => {
        console.log("error consumption next 7 days");
      }
    })
  }
  timeStrampConsumptionNext7days!:any[];
  powerUsageConsumptionNext7days!:any[];
  makeDataGraphNext7DaysConsumption(dataGraph : any){
    this.timeStrampConsumptionNext7days = [];
    this.powerUsageConsumptionNext7days = [];
    for(let i = 0; i < dataGraph.length; i++){
      this.timeStrampConsumptionNext7days.push(this.consNext7Days[i]['timestamp']);
      this.powerUsageConsumptionNext7days.push(this.consNext7Days[i]['powerUsage']);
    }
  }
  extractedDatesNext7Days!:string[];
  chartConsumptionNext7Days(){
    for(let i = 0; i < this.timeStrampConsumptionNext7days.length; i++){
      const dateStringList = this.timeStrampConsumptionNext7days.toString();
      const substrings = dateStringList.split(',');
     this.extractedDatesNext7Days = substrings.map(date => date.substring(0, date.indexOf('T')));

    }
   

    this.extractedDatesNext7Days.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    if (this.consumptionNext7daysGraph){

      if (this.chartNext7days) {
        this.chartNext7days.destroy();
      }
    const data = {
      labels: this.extractedDatesNext7Days,
      datasets: [{
        label: 'Consumption For The Next 7 days',
        data: this.powerUsageConsumptionNext7days,
        fill: true,
        borderColor: 'rgb(59, 193, 74)',
					backgroundColor:'rgba(59, 193, 74,0.4)',
					pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
					borderWidth: 1,
					pointBorderColor:'rgb(59, 193, 74)'

      }]
    }


      this.chartNext7days = new Chart(this.consumptionNext7daysGraph.nativeElement, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Power Consumption (kW)',
                font: {
                  size: 9,
                },
              }
            }
          }
        }
      });
    }}
    
  
       // set default graph
       HistoryConsumption() {
        switch (this.selectedGraphHistoryConsumption) {
          case 'month':
            this.consumptionPrevMonth(this.id);
            break;
          case '7days':
            this.consumptionPrev7Days(this.id);
            break;
          case '24h':
            this.consumptionPrevious24h(this.id);
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
          this.consumptionNext7Days(this.id);
        break;
        case '24h':
          this.consumptionNext24h(this.id);
        break;
      }
    }

    
    consumptionPrevious24h(id:any){
    this.timestampListPrev24h=[];
    this.powerUsageListPrev24h=[];
    this.auth.getConsumptionPrevious24Hours(id).subscribe(
      (response : any) => {
        this.graph24prev = response;
       
        this.makeData(this.graph24prev);
      }
     );
  }

  makeData(dataGraph:any){
    dataGraph.forEach((obj:any) => {
      obj.timestampPowerPairs.forEach((pair:any) => {
        const time = pair.timestamp.split('T')[1].split(':')[0];
        this.timestampListPrev24h.push(time);
        this.powerUsageListPrev24h.push(pair.powerUsage);
      });
    });

    this.timestampListPrev24h.sort((a: string, b: string) => {
      return parseInt(a) - parseInt(b);
    });
    this.previous24Graph(this.timestampListPrev24h, this.powerUsageListPrev24h);
  }

  previous24Graph(list:any, valueList:any){
    if (this.previous24ConsumptionGraph){

      if (this.chartPrev24h) {
        this.chartPrev24h.destroy();
      }

    const data = {
      labels: list,
      datasets: [{
        label: 'Consumption For The Previous 24h',
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

consumptionNext24h(id:any)
{
  this.auth.getConsumptionNext24Hours(id).subscribe(
    (response : any) => {
      this.graph24next = response;
      
      this.makeDataNext24h(this.graph24next);
    }
   );
}

makeDataNext24h(dataGraph:any){
  this.timestampListNext24h=[];
  this.powerUsageListNext24h=[];
  dataGraph.forEach((obj:any) => {
    obj.timestampPowerPairs.forEach((pair:any) => {
      const time = pair.timestamp.split('T')[1].split(':')[0];
      this.timestampListNext24h.push(time);
      this.powerUsageListNext24h.push(pair.powerUsage);
      
    });
  });

  this.timestampListNext24h.sort((a: string, b: string) => {
    return parseInt(a) - parseInt(b);
  });
  this.next24Graph(this.timestampListNext24h, this.powerUsageListNext24h);
}

next24Graph(list:any, valueList:any){
  if (this.next24ConsumptionGraph){

    if (this.chartNext24h) {
      this.chartNext24h.destroy();
    }
  const data = {
    labels: list,
    datasets: [{
      label: 'Consumption For The Next 24h',
      data: valueList,
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
            size: 10
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
  this.chartNext24h = new Chart(this.next24ConsumptionGraph.nativeElement, {
    type: 'line',
    data: data,
    options: options,
  });
}
}
/*
  PRODUCTION
*/

selectedGraphHistoryProduction = '24h'; 
    HistoryProduction(graph: string) {
    this.selectedGraphHistoryProduction = graph;
    switch (graph) {
      case 'month':
          this.productionPrevMonth(this.id);
      break;
      case '7days':
        this.productionPrev7Days(this.id);
      break;
      case '24h':
        this.productionPrevious24h(this.id);
      break;
    }
  }

  selectedGraphFutureProduction = '24h'; // set default graph
      FutureProduction(graph: string) {
      this.selectedGraphFutureProduction = graph;
      switch (graph) {
        case 'month':
          this.productionNextMonth(this.id);
        break;
        case '7days':
          this.productionNext7Days(this.id);         
        break;
        case '24h':
          this.productionNext24h(this.id);
        break;
      }
    }
    
    productionPrevious24h(id:any)
    {
      this.timestampListProductionPrev24h=[];
      this.powerUsageListProductionPrev24h=[];
      this.auth.getProductionPrevious24Hours(id).subscribe(
        (response : any) => {
          this.graphProduction24prev = response;
          this.makeDataProduction24(this.graphProduction24prev);
        }
       );
    }
    
    makeDataProduction24(dataGraph:any){
      dataGraph.forEach((obj:any) => {
        obj.timestampPowerPairs.forEach((pair:any) => {
          const time = pair.timestamp.split('T')[1].split(':')[0];
          this.timestampListProductionPrev24h.push(time);
          this.powerUsageListProductionPrev24h.push(pair.powerUsage);
        });
      });
    
      this.timestampListProductionPrev24h.sort((a: string, b: string) => {
        return parseInt(a) - parseInt(b);
      });
      this.previousProduction24Graph(this.timestampListProductionPrev24h, this.powerUsageListProductionPrev24h);
    }
    
    previousProduction24Graph(list:any, valueList:any){
      if (this.previous24ProductionGraph){
    
        if (this.chartProductionPrev24) {
          this.chartProductionPrev24.destroy();
        }
    
      const data = {
        labels: list,
        datasets: [{
          label: 'Production For The Previous 24h',
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
              text: 'Power production (kW)',
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
      this.chartProductionPrev24 = new Chart(this.previous24ProductionGraph.nativeElement, {
        type: 'line',
        data: data,
        options: options,
      });
    }
    }
    
    timeStampProductionPrevMonth!:any[];
    powerUsageProductionPrevMonth!:any[];
    productionPrevMonth(id:any)
    {
      this.timeStampProductionPrevMonth = [];
      this.powerUsageProductionPrevMonth = [];
      this.auth.getProductionPrevMonth(id).subscribe(
        {
          next: (response : any) => {
            this.productionPrevMonthUser = response[0]['timestampPowerPairs'];
    
    
            for(let i = 0; i < this.productionPrevMonthUser.length; i++){
              this.timeStampProductionPrevMonth.push(this.productionPrevMonthUser[i]['timestamp']);
              this.powerUsageProductionPrevMonth.push(this.productionPrevMonthUser[i]['powerUsage']);
            }
    
              this.chartProductionPreviousMonth();
    
            },
          error: () => {
            console.log("GRESKA.");
          }
        }
      );
    }
    extractedDatesProductionPrevMonth!:string[];
    chartProductionPrevMonth!:any;
    chartProductionPreviousMonth(){
      for(let i = 0; i < this.timeStampProductionPrevMonth.length; i++){
        const dateStringList = this.timeStampProductionPrevMonth.toString();
        const substrings = dateStringList.split(',');
       this.extractedDatesProductionPrevMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
    
      }
    
      this.extractedDatesConsumptionPrevMonth.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      if (this.productionPrevMonthGraph){
    
        if (this.chartProductionPrevMonth) {
          this.chartProductionPrevMonth.destroy();
        }
    
      const data = {
        labels: this.extractedDatesProductionPrevMonth,
        datasets: [{
          label: 'Production For The Previous Month',
          data: this.powerUsageProductionPrevMonth,
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
                size: 10,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Power Production (kW)'
            },
            ticks: {
              font: {
                size: 9,
              },
            },
          },
        },
      };
      this.chartProductionPrevMonth = new Chart(this.productionPrevMonthGraph.nativeElement, {
        type: 'line',
        data: data,
        options: options,
      });
    }
    }
    
    prodPrev7Days = [];
    productionPrev7Days(id : any){
      this.auth.getProductionPrev7days(id).subscribe({
        next:(response : any) => {
          this.prodPrev7Days = response[0]['timestampPowerPairs'];
          this.makeDataGraphPrev7DaysProduction(this.prodPrev7Days);
          
          this.chartProductionPrev7Days();
        },
        error : (err : any) => {
          console.log("error production previous 7 days");
        }
      })
    }
    
    
    makeDataGraphPrev7DaysProduction(dataGraph : any){
      this.timeStrampProductionPrev7days = [];
      this.powerUsageProductionPrev7days = [];
      for(let i = 0; i < dataGraph.length; i++){
        this.timeStrampProductionPrev7days.push(this.prodPrev7Days[i]['timestamp']);
        this.powerUsageProductionPrev7days.push(this.prodPrev7Days[i]['powerUsage']);
      }
    }
    extractedDatesProductionPrev7Days!:string[];
    chartPrev7daysProduction!:any;
    chartProductionPrev7Days(){
      for(let i = 0; i < this.timeStrampProductionPrev7days.length; i++){
        const dateStringList = this.timeStrampProductionPrev7days.toString();
        const substrings = dateStringList.split(',');
       this.extractedDatesProductionPrev7Days = substrings.map(date => date.substring(0, date.indexOf('T')));
    
      }
      // this.extractedDatesProductionPrev7Days.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
      if (this.productionPrev7daysGraph){
        if (this.chartPrev7daysProduction) {
          this.chartPrev7daysProduction.destroy();
        }
    
      const data = {
        labels: this.extractedDatesProductionPrev7Days,
        datasets: [{
          label: 'Production For The Previous 7 days',
          data: this.powerUsageProductionPrev7days,
          fill: true,
          borderColor: 'rgb(255, 200, 0)',
          backgroundColor:'rgba(255, 200, 0,0.4)',
          pointBackgroundColor: 'rgba(255, 200, 0,0.7)',
          borderWidth: 1,
          pointBorderColor:'rgb(255, 200, 0)'
    
        }]
      }
    
        this.chartPrev7daysProduction= new Chart(this.productionPrev7daysGraph.nativeElement, {
          type: 'bar',
          data: data,
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Power Production (kW)',
                  font: {
                    size: 9,
                  },
                }
              }
            }
          }
        });
    }
    }

    productionNext24h(id:any)
    {
      this.timestampListProductionNext24h=[];
      this.powerUsageListProductionNext24h=[];
      this.auth.getProductionNext24Hours(id).subscribe(
        (response : any) => {
          this.graphProduction24next = response;
        
          this.makeDataProductionNext24(this.graphProduction24next);
        }
       );
    }
    
    makeDataProductionNext24(dataGraph:any){
      dataGraph.forEach((obj:any) => {
        obj.timestampPowerPairs.forEach((pair:any) => {
          const time = pair.timestamp.split('T')[1].split(':')[0];
          this.timestampListProductionNext24h.push(time);
          this.powerUsageListProductionNext24h.push(pair.powerUsage);
        });
      });
    
      this.timestampListProductionNext24h.sort((a: string, b: string) => {
        return parseInt(a) - parseInt(b);
      });
      this.nextProduction24Graph(this.timestampListProductionNext24h, this.powerUsageListProductionNext24h);
    }
    chartProductionNext24!:any;
    nextProduction24Graph(list:any, valueList:any){
      if (this.next24ProductionGraph){
    
        if (this.chartProductionNext24) {
          this.chartProductionNext24.destroy();
        }
    
      const data = {
        labels: list,
        datasets: [{
          label: 'Production For The Next 24h',
          data: valueList,
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
              text: 'Power production (kW)',
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
      this.chartProductionNext24 = new Chart(this.next24ProductionGraph.nativeElement, {
        type: 'line',
        data: data,
        options: options,
      });
    }
    }
    prodNext7Days = [];
    productionNext7Days(id : any){
      this.auth.getProductionNext7days(id).subscribe({
        next:(response : any) => {
          this.prodNext7Days = response[0]['timestampPowerPairs'];
          this.makeDataGraphNext7DaysProduction(this.prodNext7Days);
       
          this.chartProductionNext7Days();
        },
        error : (err : any) => {
          console.log("error production next 7 days");
        }
      })
    }
    
    timeStrampProductionNext7days!:[];
    powerUsageProductionNext7days!:[];
    makeDataGraphNext7DaysProduction(dataGraph : any){
      this.timeStrampProductionNext7days = [];
      this.powerUsageProductionNext7days = [];
      for(let i = 0; i < dataGraph.length; i++){
        this.timeStrampProductionNext7days.push(this.prodNext7Days[i]['timestamp']);
        this.powerUsageProductionNext7days.push(this.prodNext7Days[i]['powerUsage']);
      }
    }
    extractedDatesProductionNext7Days!:string[];
    chartNext7daysProduction!:any;
    chartProductionNext7Days(){
      for(let i = 0; i < this.timeStrampProductionNext7days.length; i++){
        const dateStringList = this.timeStrampProductionNext7days.toString();
        const substrings = dateStringList.split(',');
       this.extractedDatesProductionNext7Days = substrings.map(date => date.substring(0, date.indexOf('T')));
    
      }

    
      this.extractedDatesProductionNext7Days.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
      if (this.productionNext7daysGraph){
    
        if (this.chartNext7daysProduction) {
          this.chartNext7daysProduction.destroy();
        }
    
      const data = {
        labels: this.extractedDatesProductionNext7Days,
        datasets: [{
          label: 'Production For The Next 7 days',
          data: this.powerUsageProductionNext7days,
          fill: true,
          borderColor: 'rgb(59, 193, 74)',
          backgroundColor:'rgba(59, 193, 74,0.4)',
          pointBackgroundColor: 'rgba(59, 193, 74,0.7)',
          borderWidth: 1,
          pointBorderColor:'rgb(59, 193, 74)'
    
        }]
      }
    
        this.chartNext7daysProduction= new Chart(this.productionNext7daysGraph.nativeElement, {
          type: 'bar',
          data: data,
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Power Production (kW)',
                  font: {
                    size: 9,
                  },
                }
              }
            }
          }
        });
    }
    }
    
    timeStampProductionNextMonth!:[];
   
    productionNextMonth(id:any)
    {
      this.timeStampProductionNextMonth = [];
      this.powerUsageProductionNextMonth = [];
      this.auth.getProductionNextMonth(id).subscribe(
        {
          next: (response : any) => {
            this.productionNextMonthUser = response[0]['timestampPowerPairs'];
    
    
            for(let i = 0; i < this.productionNextMonthUser.length; i++){
              this.timeStampProductionNextMonth.push(this.productionNextMonthUser[i]['timestamp']);
              this.powerUsageProductionNextMonth.push(this.productionNextMonthUser[i]['powerUsage']);
            }
    
              this.chartProductionNextMonth();
    
            },
          error: () => {
            console.log("GRESKA.");
          }
        }
      );
    }
    extractedDatesProductionNextMonth!:string[];
    chartProdNextMonth!:any;
    chartProductionNextMonth(){
      for(let i = 0; i < this.timeStampProductionNextMonth.length; i++){
        const dateStringList = this.timeStampProductionNextMonth.toString();
        const substrings = dateStringList.split(',');
       this.extractedDatesProductionNextMonth = substrings.map(date => date.substring(0, date.indexOf('T')));
    
      }
    
      this.extractedDatesProductionNextMonth.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      if (this.productionNextMonthGraph){
    
        if (this.chartProdNextMonth) {
          this.chartProdNextMonth.destroy();
        }
    
      const data = {
        labels: this.extractedDatesProductionNextMonth,
        datasets: [{
          label: 'Production For The Next Month',
          data: this.powerUsageProductionNextMonth,
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
                size: 10,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Power Production (kW)'
            },
            ticks: {
              font: {
                size: 9,
              },
            },
          },
        },
      };
      this.chartProdNextMonth = new Chart(this.productionNextMonthGraph.nativeElement, {
        type: 'line',
        data: data,
        options: options,
      });
    }
    }
    
   

}


  



  





