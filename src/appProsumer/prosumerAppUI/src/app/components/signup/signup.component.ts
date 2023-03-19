import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';

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
    private auth: AuthService
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
    if(this.loginForm.valid){
      this.auth.register(this.loginForm.get('username')?.value, this.loginForm.get('email')?.value,this.loginForm.get('address')?.value,this.loginForm.get('number')?.value,this.loginForm.get('password')?.value)
      .subscribe(
        (response) => {
          this.toast.success({detail:"Success", summary:"Account created", duration:3000 })
          this.auth.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
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

}
