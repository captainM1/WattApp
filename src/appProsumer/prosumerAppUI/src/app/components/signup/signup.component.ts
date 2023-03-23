import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from "ngx-cookie-service"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent  implements OnInit{
  submitted = false;
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";
  isText: boolean = false;
  loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private toast : NgToastService,
    private auth: AuthService,
    private cookie: CookieService
    ){}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      email : ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      address: ['', Validators.required],
      phonenumber: ['', Validators.required],
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
    if(this.loginForm.invalid){

      console.log(this.loginForm.value);
      this.toast.error({detail:"Error", summary:"Something went wrong!", duration:3000 })
      this.validateAllFormFields(this.loginForm);
      this.router.navigate(['signup']);
      return;
    }else if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.auth.register(this.loginForm.get('username')?.value,this.loginForm.get('email')?.value,this.loginForm.get('address')?.value, this.loginForm.get('phonenumber')?.value, this.loginForm.get('password')?.value,)
      .subscribe((token) =>
        {
            this.loginForm.reset();
            this.cookie.set("token", token);
            this.toast.success({detail:"Success", summary: "Register successful!", duration:3000});
        }
      );
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

}
