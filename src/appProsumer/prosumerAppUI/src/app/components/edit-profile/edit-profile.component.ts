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
export class EditProfileComponent implements OnInit, AfterViewInit{

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
  type: string = "password";
  type2: string = "password";
  type3: string = "password";
  eyeIcon: string = "fa-eye-slash";
  eyeIcon2: string = "fa-eye-slash";
  eyeIcon3: string = "fa-eye-slash";
  isText: boolean = false;
  isText2: boolean = false;
  isText3: boolean = false;
  resetForm!: FormGroup;
  submitted = false;


  @ViewChild('exampleModal') exampleModal!: ElementRef;

  constructor(
    private auth : AuthUserService,
    private serv : AuthService,
    private fb: FormBuilder,
    private messageService:MessageService
  ){}
  ngAfterViewInit(): void {
    this.exampleModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.reset();
    });
  }

  ngOnInit(): void {
    this.getToken();
    this.resetForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },{
      validator: ConfirmPasswordValidator("password","confirmPassword")
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

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  hideShowPass2(){
    this.isText2 = !this.isText2;
    this.isText2 ? this.eyeIcon2 = "fa-eye" : this.eyeIcon2 = "fa-eye-slash";
    this.isText2 ? this.type2 = "text" : this.type2 = "password";
  }

  hideShowPass3(){
    this.isText3 = !this.isText3;
    this.isText3 ? this.eyeIcon3 = "fa-eye" : this.eyeIcon3 = "fa-eye-slash";
    this.isText3 ? this.type3 = "text" : this.type3 = "password";
  }

  get fields(){
    return this.resetForm.controls;
  }

  onReset()
  {
    this.submitted = true;
    if(this.resetForm.valid){
      this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Password reset successfully!' });
      this.resetForm.reset();
      return;
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error reseting password', detail: 'Try again' });
    }
  }

  reset()
  {
    this.resetForm.reset();
    this.type = "password";
    this.type2 = "password";
    this.type3 = "password";
    this.eyeIcon = "fa-eye-slash";
    this.eyeIcon2 = "fa-eye-slash";
    this.eyeIcon3 = "fa-eye-slash";
  }
}
