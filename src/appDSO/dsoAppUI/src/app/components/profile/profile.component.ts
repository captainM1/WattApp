import { Component, OnInit } from '@angular/core';
import { AuthService } from 'service/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  allUsers!: any[];
  userID!: any;
  token!:any;
  firstName!:string;
  lastName!:string;
  phoneNumber!: string;
  address!: string;
  city!: string;
  country!: string;
  email!: string;

  constructor(
    private serv : AuthService
  ){}
  ngOnInit(): void {
    this.getToken()
  }
  
  
  getToken(){
    this.token = this.serv.getToken();
    console.log(this.token)
    this.serv.getDispecher(this.token).subscribe(
      (response :any)=>{
       this.userID = response;
       console.log(this.userID);
       this.firstName = response.firstName;
       this.firstName = response.firstName;
       this.lastName = response.lastName;
       this.phoneNumber = response.phoneNumber;
       this.address = response.address;
       this.city = response.city;
       this.country = response.country;
       this.email = response.email;

      }
    )
  }
}
