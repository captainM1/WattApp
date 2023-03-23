import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-maps',
  template: '<div #mapContainer class="map-container"></div>',
  styles: [`
    .map-container {
      height: 300px;
      width: 500px;
    }
  `]
})
export class MapsComponent implements AfterViewInit {
  @ViewChild('mapContainer')
  mapContainer!: ElementRef;
  map!: google.maps.Map;

  ngAfterViewInit(): void {
    const positions: google.maps.LatLngLiteral[] = [
      { lat:44.01667 , lng: 20.91667 },
      { lat: 44.013615 , lng: 20.923817 },
      { lat: 43.9333 , lng: 21.1167 }
    ];

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 44, lng: 21},
      zoom: 11
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.createMarkers(this.map, positions);
  }

  createMarkers(map: google.maps.Map, positions: google.maps.LatLngLiteral[]): google.maps.Marker[] {
    const markers: google.maps.Marker[] = [];
    for (let i = 0; i < positions.length; i++) {
      const marker = new google.maps.Marker({
        position: positions[i],
        map: map,
        title: 'Marker ' + (i + 1)
      });
      markers.push(marker);
    }
    return markers;
  }
}