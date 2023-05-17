import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth.service';
import { MessageService } from 'primeng/api';
import { CookieService } from "ngx-cookie-service";
import { ConfirmPasswordValidator } from 'app/helpers/confirm-password.validator';
import { Role } from 'models/User';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  submitted = false;
  type: string = "password";
  type2: string = "password";
  eyeIcon: string = "fa-eye-slash";
  eyeIcon2: string = "fa-eye-slash";
  isText: boolean = false;
  isText2: boolean = false;
  signupForm!: FormGroup;
  allWorkers: any;
  workers!: Role[];
  disp!:Role;
  public emailModal : any;
  public firstNameModal: any;
  public lastNameModal: any;
  public roleModal : any;
  public mobileModal:any;
  @ViewChild('profileDispacher') profileDispacher!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private router : Router,
    private auth: AuthService,private cookie: CookieService,
    private messageService: MessageService
    ){}

    ngOnInit(): void {
      this.signupForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email : ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        phonenumber: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },{
        validator: ConfirmPasswordValidator("password","confirmPassword")
      }
      )
      this.auth.getAllDispechers().subscribe(
        (response) => {
          this.allWorkers = response;
        }
      )
    }

    get fields(){
      return this.signupForm.controls;
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
    firstName!: string;
    lastName!:string;
    onSubmit(){
      this.submitted = true;
      if(this.signupForm.invalid){

        this.messageService.add({ severity: 'error', summary: 'Invalid data', detail: 'Invalid data format', life:1000 });
        this.router.navigate(['signup']);
        return;
      }else if(this.signupForm.valid){
        if( this.signupForm.get('firstName')?.value != null  && this.signupForm.get('lastName') != null){
           this.firstName = this.signupForm.get('firstName')?.value;
           this.lastName = this.signupForm.get('lastName')?.value;
        }
        this.auth.register(this.signupForm.get('firstName')?.value,this.signupForm.get('lastName')?.value,"Dispatcher",this.signupForm.get('phonenumber')?.value,this.signupForm.get('email')?.value,this.signupForm.get('password')?.value)
        .subscribe((message) =>
          {
              this.signupForm.reset();
              this.messageService.add({ severity: 'success', summary: 'Register success', detail: "Welcome  "+this.firstName+ " "+this.lastName});
              this.router.navigate(['signin'])
          }
        );
      }
    }
    deleteDispecher(id : any){
      if (confirm('Are you sure you want to delete this record?')) {
      this.auth.deleteDispathcer(id).subscribe({
        next:(response : any) => {
          this.messageService.add({ severity: 'success', summary: 'Register deleted'});
          location.reload();
        },
        error:(err : any)=>{
          console.log("ERRROR delete" + err);
        }
      })
    }
    }
    giveMeWorker(id : any){
      this.auth.getDispacher(id).subscribe({
        next:(response : any) => {
          this.disp = response;
          this.firstNameModal = this.disp.firstName;
          this.lastNameModal = this.disp.lastName;
          this.emailModal = this.disp.email;
          this.mobileModal = this.disp.phoneNumber;
          this.roleModal = this.disp.role;
        }
      })
    }
 
}
