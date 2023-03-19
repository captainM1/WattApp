import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from "ngx-cookie-service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  submitted = false;
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";
  isText: boolean = false;
  loginForm!: FormGroup;
  public resetPasswordEmail !: string;
  public isValidEmail !: boolean;
  
  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private toast : NgToastService,
    private auth: AuthService,
    private cookie: CookieService
    ){}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email : ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  get fields(){
    return this.loginForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .subscribe(
        (response) => {
          this.cookie.set('jwtToken', response);
          this.toast.success({detail:"Success", summary:"Logged in", duration:3000 })
          setTimeout(() => {
            this.router.navigate(['home'])
          }, 2000);
        },
        (error) => {
          if (error.status === 400) {
            this.toast.error({detail:"Error", summary:error.error, duration:3000 })
            this.router.navigate(['signin'])
          }
        }
      );
    }else{
      this.toast.error({detail:"Error", summary:"Form data is not valid", duration:3000 })
      this.router.navigate(['signin'])
    }
  }

  private validateAllFormFields(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(
      field => {
        const control = formGroup.get(field);
        if(control instanceof FormControl){
          console.log(control.value);

          control?.markAsDirty({onlySelf: true})
        }else if(control instanceof FormGroup){
          this.validateAllFormFields(control);
        }
      })
    }


    checkValidEmail(event:string)
    {
      const value = event;
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
      this.isValidEmail = pattern.test(value);
      return this.isValidEmail;
    }

    confirmToSend()
    {
      if(this.checkValidEmail(this.resetPasswordEmail))
      {
        console.log(this.resetPasswordEmail);
        this.resetPasswordEmail = "";
        const buttnoRef = document.getElementById("closeBtn");
        buttnoRef?.click();

        //API call to be done
      }
    }

}


