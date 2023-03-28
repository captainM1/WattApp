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

  selectedOption = 'consumer';
  addConsumerForm!: FormGroup;
  addProducerForm!: FormGroup;
  addStorageForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private toast : NgToastService
  ){}

  onSelect(selectedValue: string) {
    switch (selectedValue) {
      case 'consumer':
        this.showConsumer = true;
        this.showProducer = false;
        this.showStorage = false;
        break;
      case 'producer':
        this.showConsumer = false;
        this.showProducer = true;
        this.showStorage = false;
        break;
      case 'storage':
        this.showConsumer = false;
        this.showProducer = false;
        this.showStorage = true;
        break;
    }
  }

  

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
