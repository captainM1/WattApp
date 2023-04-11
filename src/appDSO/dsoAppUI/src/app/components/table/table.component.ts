import { write, writeXLSX } from 'xlsx';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Device, Info, User } from 'models/User';
import { AuthService } from 'service/auth.service';
import {PageEvent} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; 
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ProfileComponent } from 'app/profile/profile.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit {
// filtriranje
  _searchByName: string = '';
  _searchByCity: string = '';
  _searchByAddress: string = '';
// export 
  filtered! : User[];
  activeItem:any;
  exportData : any[] = [];
  exportSelected: boolean = false;
// pagination
  public page = 1;
  public pageSize = 5;
  
  showAllUsersOnMap : boolean = true;
  lengthOfUsers!: number;
  allUsers!: User[];
  allUserDevices! : Info[];
  userIDCoords!:any[];
  private userCoords!: any[];

  public toggleTable : boolean = false;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  selected: string = "";
  
  powerUsage!:string;
  deviceGroup!: any[];

// device type
  producers!: any[];
  consumers!: any[];
  storage!: any[];
 
  @ViewChild('myTable') myTable!: ElementRef;

  constructor(
    private auth : AuthService,
    private table : MatTableModule,


  ){}

  
  ngOnInit(): void {
    
    this.showMeUsers();
    this.onInitMap();
    this.showCoordsForEveryUser();
    this.getDeviceGroup();
    
    
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
 
 
  public showMeUsers(){
   
    
    this.auth.getPagination(this.page, this.pageSize).subscribe(
      (response : any)=> {
        this.allUsers = response;
        for(let user of this.allUsers){
          
          this.auth.getUserPowerUsageByID(user.id).subscribe(
            (response: any)=>{
              user.powerUsage = (response/10).toFixed(2);
              user.selected = false;
            }
          )
        }
        
      }
    );
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
    
    this.auth.getUserPowerUsageByID(id).subscribe(
      (response: any) => {
        for (let user of this.allUsers) {
          if (user.id === id) {
            this.activeItem = user.id;
            user.powerUsage = (response / 10).toFixed(2);
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
  
 
  // paginacija za menjanje strana
  nextPage(){
    if(this.lengthOfUsers / this.pageSize > 0){
      this.page++;
    }
  }

  prevPage(){
    if(this.page !== 1){
      this.page--;
    }
  }
  

  showMeDevices(id : string){
    this.getDeviceGroup();
    console.log(id);
    this.auth.getPowerUsageForDeviceByID(id).subscribe(
      (response : any)=>{
        
        console.log(response);
      }
    )
    this.toggleTable = true;
    this.auth.getDeviceInfoUserByID(id).subscribe(
      (response : any) => {
        this.allUserDevices = response;
        for(let us of this.allUserDevices){
          for(let p of this.producers){
            for(let c of this.consumers){
              for(let s of this.storage){
                if(us.deviceTypeName === p['name'])
                {
                  us.typeOfDevice = 'Producer';
                  
                }
                if(us.deviceTypeName === c['name']){
                  us.typeOfDevice = "Consumer";
                }
                if(us.deviceTypeName === s['name']){
                  us.typeOfDevice = 'Storage';
                }
              }
          }
          }
        }
        // console.log(this.allUserDevices);
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
              }
      )}
          }
        )}
      

  toggleColumn(){
    this.toggleTable = !this.toggleTable;
  }

  
    
  
}

    


  





