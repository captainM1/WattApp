import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth.service';
import { MessageService } from 'primeng/api';
import { CookieService } from "ngx-cookie-service";

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
  
  constructor(private fb: FormBuilder, private router : Router,private auth: AuthService,private cookie: CookieService,
    private messageService: MessageService){}
  
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
          this.messageService.add({ severity: 'success', summary: 'Logged in', detail: 'Welcome back' });
          setTimeout(() => {
            this.router.navigate(['dashboard'])
          }, 1000);
        },
        (error) => {
          if (error.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Invalid credentials', detail: error.error });  
            this.router.navigate(['signin'])
          }
        }
      );
    }else{
      this.messageService.add({ severity: 'error', summary: 'Invalid credentials', detail: 'Invalid data format' });  
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


