import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import jwt_decode from 'jwt-decode';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile-prosumer',
  templateUrl: './profile-prosumer.component.html',
  styleUrls: ['./profile-prosumer.component.css']
})
export class ProfileProsumerComponent implements OnInit{

  allUsers!: any[];
  userID!: User;
  token!:any;



  constructor(
    private auth : AuthUserService,
    private serv : AuthService
  ){}

  ngOnInit(): void {
    this.getUser();
    this.getToken();
  }

  getUser(){
    this.auth.getAllUsers().subscribe(
      (response : any)=>{
        console.log(response);
      }
    )
  }

  getToken(){
    this.token = this.serv.getToken();
    console.log(this.token)
    this.auth.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response;
       console.log(this.userID);
      }
    )
  }
}




