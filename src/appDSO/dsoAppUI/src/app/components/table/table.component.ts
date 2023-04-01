import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Device, User } from 'models/User';
import { AuthService } from 'service/auth.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit  {
  
  allUsers!: User[];
  // deviceOfUserID! : Device[];
  private userCoords!: any[];
  // coords?: number[];
  userIDCoords!:any[];
  private id : any;
  private firstName?: string;
  private lastName?: string;
  private address? : string;
 
  showAllUsersOnMap : boolean = true;
  
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  public page = 1;
  public pageSize = 10;
  private lengthOfUsers!: number;

  constructor(
    private auth : AuthService
  ){}

  ngOnInit(): void {
    
    this.showMeUsers();
    this.onInitMap();
    this.showCoordsForEveryUser()
  }

  public showMeUsers(){

    this.auth.getPagination(this.page, this.pageSize).subscribe(
      (response : any)=> {
        this.allUsers = response;
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
    console.log("ShowMeOnMap", this.showAllUsersOnMap);
    
    for(const mark of this.markers){
      this.map.removeLayer(mark);
    }

    this.auth.getCoordsByUserID(id).subscribe(
      (response : any) => {
        const latlng = L.latLng(JSON.parse(response['coordinates']));
        // console.log(JSON.parse(response['coordinates']))
        const marker = L.marker(latlng).addTo(this.map);
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
      
    

    // this.auth.getCoordsID("5E12058A-2F83-4F95-B108-BF0B5811DAEE").subscribe(
    //   (response : any) =>{
        
    //     console.log("USER",response);
    //   }
    // )
    // this.initMap();

  
  
  
 
}

    

  //   // const popup = L.popup().setLatLng(this.centroid).setContent('<p>User coords:<br> Total producing: <br> Total consuping: <br></p>').openOn(this.map);
  //   var marker = L.marker([44.0128,20.9114],
  //     {alt: 'Kyiv'}).addTo(this.map) // "Kyiv" is the accessible name of this marker
  //     .bindPopup('<p>First name: <br>Last Name: <br>Total Production: <br> Total Consumption:</p>');
  //   // this.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  
  //   // const jittery = Array(5).fill(this.centroid).map(
  //   //   x =>[x[0]+(Math.random()- .5)/10, x[1]+(Math.random() - .5)/10],
      
  //   // ).map(
  //   //   x=>L.marker(x as L.LatLngExpression)
  //   // ).forEach(
  //   //   x => x.addTo(this.map)
  //   // );
  //     tiles.addTo(this.map);

  //     // tiles.bindPopup(popup).openPopup();
  // } 
  
  




