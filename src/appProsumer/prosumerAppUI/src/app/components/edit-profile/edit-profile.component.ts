import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  allUsers!: any[];
  userID!: User;
  token!:any;
  firstName!:string;
  lastName!:string;
  phoneNumber!: string;
  address!: string;
  city!: string;
  country!: string;
  email!: string;



  constructor(
    private auth : AuthUserService,
    private serv : AuthService
  ){}

  ngOnInit(): void {
    this.getToken();
  }

  getToken(){
    this.token = this.serv.getToken();
    console.log(this.token)
    this.auth.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response;
       console.log(this.userID);
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
