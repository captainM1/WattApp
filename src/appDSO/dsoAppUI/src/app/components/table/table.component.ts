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
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit {
  _searchByName: string = '';
  _searchByAddress: string = '';
  exportData: any[] = [];

  allUserDevices!: Info[];
  userIDCoords!: any[];

  private userCoords!: any[];
  private id: any;
  private firstName?: string;
  private lastName?: string;
  private address?: string;

  public toggleTable: boolean = false;

  showAllUsersOnMap: boolean = true;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];

  selected: string = "";
  page = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];

  public lengthOfUsers: number = 0;
  allUsers: User[] = [];
  filtered: User[] = [];

  powerUsage!: string;
  deviceGroup!: any[];
  producers!: any[];
  consumers!: any[];
  storage!: any[];

  constructor(
    private auth: AuthService,
    private table: MatTableModule
  ){}

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

  public showMeUsers(page: number, pageSize: number) {
    this.auth.getPagination(page, pageSize).subscribe(
      (response: any) => {
        this.allUsers = response;
        this.filtered = response;
        for(let user of this.allUsers){
          this.auth.getUserPowerUsageByID(user.id).subscribe(
            (response: any) => {
              user.powerUsage = (response/10).toFixed(2);
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
    this.auth.getUserPowerUsageByID(id).subscribe(
      (response: any) => {
        for (let user of this.allUsers) {
          if (user.id === id) {
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
}

    


  





