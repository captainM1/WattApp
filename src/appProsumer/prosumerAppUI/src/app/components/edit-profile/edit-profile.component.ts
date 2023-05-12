import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{

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
  resetForm!: FormGroup;
  submitted = false;


  @ViewChild('exampleModal') exampleModal!: ElementRef;

  constructor(
    private auth : AuthUserService,
    private serv : AuthService,
    private fb: FormBuilder,
    private messageService:MessageService
  ){}

  ngOnInit(): void {
    this.getToken();
  }

  getToken(){
    this.token = this.serv.getToken();
    console.log(this.token)
    this.auth.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
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

  get fields(){
    return this.resetForm.controls;
  }




  onSubmit() {
    const profileData = {
      phoneNumber: this.phoneNumber,
      address: this.address,
      email: this.email,
      country: this.country,
      firstName: this.firstName,
      lastName: this.lastName,
      sharesDataWithDso: true,
      dsoHasControl: true,
      city: this.city
    };

    this.auth.putUpdateUser(this.userID, profileData).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }


}
