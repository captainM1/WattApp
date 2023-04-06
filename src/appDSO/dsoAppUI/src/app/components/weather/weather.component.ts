
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit{

  public weatherSearchForm!: FormGroup;
  public weatherData : any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService
  ){}

  ngOnInit(): void {
    
    this.weatherSearchForm = this.formBuilder.group({
      location: ['']
    })
    this.sendToAPIXU();
  }


  sendToAPIXU(){
    this.auth.getWeather().subscribe(
      (response : any)=>{
        this.weatherData = response;
        console.log(response);
      }
    )
  }
}
