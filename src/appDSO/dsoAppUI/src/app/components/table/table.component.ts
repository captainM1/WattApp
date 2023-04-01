import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Device, User } from 'models/User';
import { AuthService } from 'service/auth.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit{
  
  allUsers!: User[];
  // deviceOfUserID! : Device[];
  userCoords!: any[];
  // coords?: number[];
  userIDCoords!:any[];
  


 
  
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private latlng: L.LatLng[] = [];
  
  constructor(
    private auth : AuthService
  ){}


  ngOnInit(): void {
    
    this.auth.getPagination(1, 5).subscribe(
      (response : any)=> {
        this.allUsers = response;

        for(const user of this.allUsers){
          this.auth.getCoordsByUserID(user.id).subscribe(
            (response : any)=>{
              this.userIDCoords = response;
              
            }
          )
        }
      }
    );


    this.auth.getCoords().subscribe(
      (response : any) =>{
        this.userCoords = response;
        
        for(const user of this.userCoords){
          const latlng = L.latLng(JSON.parse(user['coordinates']));
          const marker = L.marker(latlng).addTo(this.map);
          this.markers.push(marker);
        }

    });

    this.map = L.map('map').setView([44.0165,21.0069],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

   
    

    // this.auth.getDevices(this.returnUserID).subscribe(
    //   (response : any) => {
    //     this.deviceOfUserID = response;
    //     console.log(this.deviceOfUserID[0].deviceType.name);
        
    //     console.log(this.deviceOfUserID[0].deviceType.group);
        
    //     console.log(this.deviceOfUserID[0].deviceType.manifacturer.name);
    //   }
    // )
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
  
  




