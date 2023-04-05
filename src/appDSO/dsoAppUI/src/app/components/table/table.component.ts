import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Device, Info, User } from 'models/User';
import { AuthService } from 'service/auth.service';
import {PageEvent} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'; 
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit {
  
  _searchByName: string = '';
  _searchByAddress: string = '';

  filtered! : User[];
  

  exportData : any[] = [];

  allUsers!: User[];
  allUserDevices! : Info[];
  userIDCoords!:any[];

  private userCoords!: any[];
  private id : any;
  private firstName?: string;
  private lastName?: string;
  private address? : string;

  public toggleTable : boolean = false;

  showAllUsersOnMap : boolean = true;
  
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  pageSizeOption = ['5','10','15'];
  selected: string = "";

  public page = 1;
  public pageSize = 5;
  private lengthOfUsers!: number;
  // tableData: any;
  
  powerUsage!:string;
  deviceGroup!: any[];
  producers!: any[];
  consumers!: any[];
  storage!: any[];

  constructor(
    private auth : AuthService,
    private table : MatTableModule
  ){}

  
  ngOnInit(): void {
    
    this.showMeUsers();
    this.onInitMap();
    this.showCoordsForEveryUser();
    this.getDeviceGroup();
    this.updatePoweUsageForUsers();
    
  }
  
  // exportSelectedData(){
  //   this.exportData = this.tableData.filter((item: { checked: any; })=>item.checked)
  // }
 
  public showMeUsers(){
   
    this.auth.getPagination(this.page, this.pageSize).subscribe(
      (response : any)=> {
        this.allUsers = response;
        this.filtered = response;
        for(let user of this.allUsers){
          this.auth.getUserPowerUsageByID(user.id).subscribe(
            (response: any)=>{
              user.powerUsage = (response/10).toFixed(2);
              console.log("USER.powerUSEGAE",user.powerUsage)
            }
          )
        }
        
      }
    );
  }

  get searchByAddress(){
    return this._searchByAddress;
  }

  set searchByAddress(value : string){
    this._searchByAddress = value;
    this.filtered = this.filterByAddressFilter(value);
  }

  filterByAddressFilter(filterTerm:string){
    if(this.filtered.length === 0 || this._searchByAddress === ''){
      return this.filtered;
    }else{
      return this.filtered.filter((user)=>{
        return 
      })
    }  
  }
// bind _searchByName ngModel
  get searchByName(){
    return this._searchByName;
  }
  
  set searchByName(value: string){
    this._searchByName = value;
    this.filtered = this.filterUsersByName(value);
  }
 
  filterUsersByName(filterTerm : string){
    if(this.allUsers.length === 0  || this._searchByName === ''){
      return this.allUsers;
    }else{
      return this.allUsers.filter((user)=>{
        return user.firstName.toLowerCase() === filterTerm.toLowerCase();
      })
    }
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
      (response : any) =>{
        this.lengthOfUsers = response['length'];
        this.userCoords = response;
        for(const user of this.userCoords){
          for(const us of this.allUsers){
            if(user.address['address'] === us.address){
              this.firstName = us.firstName;
              this.lastName = us.lastName;
              this.address = us.address;
            }
          }
          const latlng = L.latLng(JSON.parse(user['coordinates']));
          const marker = L.marker(latlng).addTo(this.map);
          marker.bindPopup(`<b>${this.firstName} ${this.lastName} <br>${this.address}`)
          this.markers.push(marker);
        }

    });
  }

 
 
  public showMeOnMap(id : string){
    
    this.showAllUsersOnMap = false;

    for(const mark of this.markers){
      this.map.removeLayer(mark);
    }
    // poziv funkcije za svih uredjaja
    this.showMeDevices(id);
    this.auth.getUserPowerUsageByID(id).subscribe(
      (response : any) =>{
        for(let user of this.allUsers){
          if(user.id === id){
            user.powerUsage = (response/10).toFixed(2);
          }
        }
       
        }
      )
    
    this.auth.getCoordsByUserID(id).subscribe(
      (response : any) => {
        const latlng = L.latLng(JSON.parse(response['coordinates']));
        const marker = L.marker(latlng).addTo(this.map);
        marker.bindPopup(`<b>${this.firstName} ${this.lastName} <br>${this.address}`)
        this.markers.push(marker);
      }
    )
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
    
  public updatePoweUsageForUsers(){
    
    
    
  }
  

  
  
 
 
}

    


  





