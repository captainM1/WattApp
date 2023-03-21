import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  showConsumer: boolean = true;
  showStorage: boolean = false;
  showProducer: boolean = false;

  submitted = false;
  addConsumerForm!: FormGroup;
  addProducerForm!: FormGroup;
  addStorageForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private toast : NgToastService
  ){}

  onSubmit(){/* Ovo nije dobro;
    this.submitted = true;
    if(this.addConsumerForm.valid){
      this.toast.success({detail:"Success", summary: "Adding device successful!", duration:3000});
      this.router.navigate(['home']);
      return;
    }else{
      this.toast.error({detail:"Error", summary:"Something went wrong!", duration:3000 })
      this.router.navigate(['addDevice'])
    }*/

  }
}
