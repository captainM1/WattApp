import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import { Router } from '@angular/router';
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
  dsoHasControl !: boolean;
  sharesDataWithDSO !: boolean;
  isValidEmail: boolean = true;
  isEmailModified: boolean = false;
  isValidPhoneNumber: boolean = true;
  isPhoneNumberModified: boolean = false;
  image: any;


  @ViewChild('exampleModal') exampleModal!: ElementRef;

  constructor(
    private auth : AuthUserService,
    private serv : AuthService,
    private fb: FormBuilder,
    private messageService:MessageService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.getToken();
  }

  getToken(){
    this.token = this.serv.getToken();
    this.auth.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.phoneNumber = response.phoneNumber;
        this.address = response.address;
        this.city = response.city;
        this.country = response.country;
        this.email = response.email;
        this.image = response.profilePicture;
        this.sharesData(this.userID);
        this.hasControl(this.userID);

      }
    )
  }

  get fields(){
    return this.resetForm.controls;
  }

  sharesData(id:any)
  {
    this.auth.getUserSharesWithDSO(id).subscribe((response)=>{
      this.sharesDataWithDSO = response;
    })
  }

  hasControl(id:any)
  {
    this.auth.getDsoHasControl(id).subscribe((response)=>{
      this.dsoHasControl = response;
    })
  }


  onSubmit() {
    const profileData = {
      phoneNumber: this.phoneNumber,
      address: this.address,
      email: this.email,
      country: this.country,
      firstName: this.firstName,
      lastName: this.lastName,
      sharesDataWithDso: this.sharesDataWithDSO,
      dsoHasControl: this.dsoHasControl,
      city: this.city,
    };

    if (!this.isValidPhoneNumber || !this.isValidEmail)
    {
       this.messageService.add({ severity: 'error', summary: 'Error updating profile!'});
    }
    else
    {
      this.auth.putUpdateUser(this.userID, profileData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Profile updated successfully!'});
          this.router.navigate(['profile-prosumer']);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error updating profile!'});
        }
      );
    }
  }


  checkValidEmail(): void {
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(this.email);
  }

  onEmailInput(): void {
    this.isEmailModified = true;
    this.checkValidEmail();
  }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
  
    reader.onloadend = () => {
      const byteArray = new Uint8Array(reader.result as ArrayBuffer);
      this.auth.uploadImage(byteArray,this.userID);
    };
  
    reader.readAsArrayBuffer(file);
    this.getToken();
  }

  checkValidPhoneNumber(): void {
    const pattern = /^(\+381(\s?|-?))?0?[\d]{2}[\d]{3,4}[\d]{3,4}$/;
    this.isValidPhoneNumber = pattern.test(this.phoneNumber);
  }

  onPhoneNumberInput(): void {
    this.isPhoneNumberModified = true;
    this.checkValidPhoneNumber();
  }

}
