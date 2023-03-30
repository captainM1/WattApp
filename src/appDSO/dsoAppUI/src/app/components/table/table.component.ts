import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  
})
export class TableComponent implements OnInit{
  
  userCoords!: any[];
  coords?: number[];
  userIDCoords! : any[];
  allUsers!: any[];
  
  private map!: L.Map;
  private centroid: L.LatLngExpression = [44.0128,20.9114]; 
  private marker! : L.Marker;
  
  
  constructor(
    private auth : AuthService
  ){}


  ngOnInit(): void {
    this.auth.getPagination(1,5).subscribe(
      (response : any)=> {
        this.allUsers = response;
      }
    );

    this.auth.getUserCoords().subscribe(
      (response : any) =>{
        this.userCoords = response;
        console.log(this.userCoords[0].address);
        this.coords = JSON.parse(response[0].coordinates);
        console.log(this.coords)
        
        
       
      });

    this.auth.getCoordsID("5E12058A-2F83-4F95-B108-BF0B5811DAEE").subscribe(
      (response : any) =>{
        
        console.log("USER",response);
      }
    )
    this.initMap();
  }
  
  private initMap(): void{
    this.map = L.map('map',{
      center: this.centroid,
      zoom: 18
  });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=Xjmy4FwEg0zjH3KOEzXy',{
      maxZoom:18,
      minZoom: 10,
      
    });

    

    // const popup = L.popup().setLatLng(this.centroid).setContent('<p>User coords:<br> Total producing: <br> Total consuping: <br></p>').openOn(this.map);
    var marker = L.marker([44.0128,20.9114],
      {alt: 'Kyiv'}).addTo(this.map) // "Kyiv" is the accessible name of this marker
      .bindPopup('<p>First name: <br>Last Name: <br>Total Production: <br> Total Consumption:</p>');
    // this.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  
    // const jittery = Array(5).fill(this.centroid).map(
    //   x =>[x[0]+(Math.random()- .5)/10, x[1]+(Math.random() - .5)/10],
      
    // ).map(
    //   x=>L.marker(x as L.LatLngExpression)
    // ).forEach(
    //   x => x.addTo(this.map)
    // );
      tiles.addTo(this.map);

      // tiles.bindPopup(popup).openPopup();
  } 
  
  

}

