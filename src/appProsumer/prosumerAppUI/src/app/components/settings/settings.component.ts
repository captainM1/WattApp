import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { BackgroundService } from 'src/app/services/background.service';import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit{
  allowAccess = false;
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
  requestStatus: string = 'no';

  constructor(private apiService: SettingsService, private auth: AuthService, private fb: FormBuilder,private backgroundService:BackgroundService,private router : Router) { }

  @ViewChild('exampleModal') exampleModal!: ElementRef;

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },{
      validator: ConfirmPasswordValidator("password","confirmPassword")
    }
    )

    this.apiService.alreadyHasReq().subscribe(
      (response) => {
        if(response == true)
          this.requestStatus = 'pending';
      }
    )
    this.apiService.statusOfReq().subscribe(
      response => {
        if (response == true) {
          this.requestStatus = 'accepted';
          this.apiService.getShareInfo().subscribe(
            (data) => {
              this.allowAccess = data;
              console.log(data);
            },
            (error) => {
              console.error('Error retrieving share information:', error);
            }
          );
          this.backgroundService.ngOnDestroy();
        }
      }
    )

    this.backgroundService.startBackgroundProcess();
    this.backgroundService.subscribeToStatusUpdate().subscribe(status => {
      this.requestStatus = status;
    });
  }

  ngOnDestroy() {
    this.backgroundService.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    this.exampleModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.reset();
    });
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
      this.resetForm.reset();
      return;
    }else{
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

  toggleAccess(){
    this.allowAccess = !this.allowAccess;
    this.apiService.updateUserDataSharing(this.allowAccess);
  }

  sendReq() {
    this.apiService.sendRequest().subscribe(
      (info) => {
      },
      (error) => {
        console.log(error);
      });
    this.requestStatus = 'pending'
  }

  cancelReq(){
    this.apiService.cancelRequest().subscribe(
      (info) => {
      },
      (error) => {
        console.log(error);
      });
      this.requestStatus = 'no'
  }

  disconnectDSO(){
    this.apiService.disconnectDSO().subscribe(
      (info) => {
      },
      (error) => {
        console.log(error);
      });
      this.requestStatus = 'no'
  }
  signOut(){
    this.auth.signOut();
  }

}
