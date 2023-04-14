import { write, writeXLSX } from 'xlsx';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Device, Info, User } from 'models/User';
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

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit, AfterViewInit {
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
  public pageSize = 5;
  
  showAllUsersOnMap : boolean = true;
  lengthOfUsers!: number;
  allUsers!: User[];
 
  private userCoords!: any[];
  private id: any;
  private firstName?: string;
  private lastName?: string;
  private address?: string;

  public toggleTable: boolean = false;
  public showDevGraph:boolean = false;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  selected: string = "";
  pageSizeOptions = [5, 10, 25, 50];

  powerUsage!: string;
  deviceGroup!: any[];
  values!:any[];

// device type
  producers!: any[];
  consumers!: any[];
  storage!: any[];

  todayPowerUsageDevice!:any;
  prev24DeviceID!:any;

  userPopUp!:any;


  @ViewChild('myTable') myTable!: ElementRef;
  @ViewChild('perHourDevice') perHourDevice!:ElementRef;

  constructor(
    private auth: AuthService,
    private table: MatTableModule,


  ){}
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.showMeUsers(this.page,this.pageSize);
    this.onInitMap();
    this.showCoordsForEveryUser();
    this.getDeviceGroup();
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.pageSize = event.rows;
    this.showMeUsers(this.page, this.pageSize);
  }
  currentSortOrder: string = 'asc';
  sortData(sortBy: string): void {
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    if (sortBy === 'powerUsage') {
      this.allUsers.sort((a, b) => {
        if (a.powerUsage < b.powerUsage) {
          return this.currentSortOrder === 'asc' ? -1 : 1;
        } else if (a.powerUsage > b.powerUsage) {
          return this.currentSortOrder === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
    console.log(this.currentSortOrder);
  }

    toggleExportSelected(): void {
      this.exportSelected = !this.exportSelected;
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
    console.log(worksheet)
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
          console.log(user)
          this.auth.getUserPowerUsageByID(user.id).subscribe(
            (response: any) => {
              user.powerUsage = (response).toFixed(2);
             
              user.selected = false;
            }
          )
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
  }

  public showMeOnMap(id: string) {
    // remove all markers from the map
    for (const mark of this.markers) {
      this.map.removeLayer(mark);
    }
    // poziv funkcije za svih uredjaja
    this.showMeDevices(id);
    // poziv informacija o user-u za pop-up
    this.popUp(id);
    console.log(id);
    this.auth.getUserPowerUsageByID(id).subscribe(
      (response: any) => {
        for (let user of this.allUsers) {
          if (user.id === id) {
            this.activeItem = user.id;
            user.powerUsage = (response).toFixed(2);
          }
        }
      }
    );
  
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
  }  

  
  
  showMeDevices(id : string){
    this.showDevGraph = !this.showDevGraph;
    // this.auth.getPrevious24DevicePerHour(id).subscribe(
    //   (response:any) => {
    //     this.prev24DeviceID = response;
    //     this.createChartFor24Previ();
    //     console.log("24Prev",response);
    //   }
    // )
    this.getDeviceGroup();
    console.log(id);
    
    this.toggleTable = true;
    this.auth.getDeviceInfoUserByID(id).subscribe(
      (response : any) => {
        this.allUserDevices = response;
        console.log("ALL USER DEVICES:",this.allUserDevices);
        for(let us of this.allUserDevices){
          
          this.auth.getPowerUsageToday(us.deviceId).subscribe(
            (response : any)=>{
              this.todayPowerUsageDevice = (response);
              us.typeOfDevice = (response).toFixed(2);
            }
          )
          // for(let p of this.producers){
          //   for(let c of this.consumers){
          //     for(let s of this.storage){
          //       if(us.deviceTypeName === p['name'])
          //       {
          //         us.typeOfDevice = 'Producer';
                  
          //       }
          //       if(us.deviceTypeName === c['name']){
          //         us.typeOfDevice = "Consumer";
          //       }
          //       if(us.deviceTypeName === s['name']){
          //         us.typeOfDevice = 'Storage';
          //       }
          //     }
          // }
          // }
        }
      
      }
    )
    console.log(this.allUserDevices);
  }

  createChartFor24Previ(){
    const list =  Object.keys(this.prev24DeviceID).map((key) =>
				key.split('T')[1].split('.')[0]
			);
			const valuesList = [];
	
			for (const key in this.prev24DeviceID) {
				if (this.prev24DeviceID.hasOwnProperty(key)) {
					valuesList.push(this.prev24DeviceID[key]);
				}
			}
      console.log(valuesList);
	
		   const data = {
		   labels: list,
		   datasets: [{
			   label: 'Device power Usage',
			   data: valuesList,
			   fill: true,
			   borderColor: 'rgb(75, 192, 192)',
			   backgroundColor:'rgba(75, 192, 192, 0.5)',
			   tension: 0.1,
			   borderWidth: 1,
		   }]
	   }
		   const options: ChartOptions = {
			   scales: {
			   x: {
          
				   title: {
				   display: true,
				   text: 'Hours',
				   },
				   ticks: {
				   font: {
					   size: 14,
				   },
				   },
			   },
			   y: {
          suggestedMin: 0,
				   title: {
				   display: true,
				   text: 'Current power usage in (kw/h)',
				   },
				   ticks: {
				   font: {
					   size: 14,
				   },
				   },
			   },
			   },
		   };
		   const stackedLine = new Chart(this.perHourDevice.nativeElement, {
			   type: 'line',
			   data: data,
			   options: options,
		   });
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
    if(modelDiv!=null){
      modelDiv.style.display = 'block';
    }
  }

  closeModel(){
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!=null){
      modelDiv.style.display = 'none';
    }
  }
  
  showDevices:boolean = false;
  showSystem:boolean = false;
  powerUsagePopUp!: number;
  @ViewChild('powerUsageGraph') powerUsageGraph!:ElementRef;

  popUp(id: string){
    this.auth.getUserInformation(id).subscribe(
      (response : any) => {
        this.userPopUp = response;
      }
    )
    this.auth.getUserPowerUsageByID(id).subscribe(
      (response : any) => {
        this.powerUsagePopUp = response;
      }
    )
  }

  // halfDought(){
  //   const data = {
  //     labels: 'Current Power Usage',
  //     datasets: [{
  //       label: 'Energy consumption ',
  //       data: [this.powerUsagePopUp, 100-this.powerUsagePopUp],
  //       fill:true,
  //       borderColor: 'rgb(251, 97, 7)',
  //       backgroundColor:'rgba(251, 97, 7,0.4)',
  //       pointBackgroundColor: 'rgba(251, 97, 7,0.7)',
  //       borderWidth: 1,
  //       pointBorderColor:'rgb(251, 97, 7)'
  //     }]
  //   }
  //   const stackedLine = new Chart(this.powerUsageGraph.nativeElement, {
  //     type: 'doughnut',
  //     data:data
  //   });
   }
  


    


  





