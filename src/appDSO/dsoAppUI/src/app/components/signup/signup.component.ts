import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth.service';
import { MessageService } from 'primeng/api';
import { CookieService } from "ngx-cookie-service";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  submitted = false;
  type: string = "password";
  eyeIcon: string = "fa-eye-slash";
  isText: boolean = false;
  signupForm!: FormGroup;
  allWorkers: any;
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
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
      this.auth.getAllDispechers().subscribe(
        (response) => {
          this.allWorkers = response
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

    onSubmit(){
      this.submitted = true;
      if(this.signupForm.invalid){
  
        this.messageService.add({ severity: 'error', summary: 'Invalid data', detail: 'Invalid data format', life:1000 });
        this.router.navigate(['signup']);
        return;
      }else if(this.signupForm.valid){
        this.auth.register(this.signupForm.get('firstName')?.value,"Dispatcher",this.signupForm.get('email')?.value,this.signupForm.get('password')?.value)
        .subscribe((message) =>
          {
              this.signupForm.reset();
              this.messageService.add({ severity: 'success', summary: 'Register success', detail: message });
              this.router.navigate(['signin'])
          }
        );
      }
    }
}
