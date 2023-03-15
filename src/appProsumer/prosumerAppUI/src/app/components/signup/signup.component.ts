import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

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
    private toast : NgToastService
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
      this.toast.error({detail:"Error", summary:"Something went wrong!", duration:3000 })
      this.router.navigate(['singup']);
      return;
    }else if(this.loginForm.valid){
      this.toast.success({detail:"Success", summary: "Login successful!", duration:3000});
      this.router.navigate(['home']);
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
