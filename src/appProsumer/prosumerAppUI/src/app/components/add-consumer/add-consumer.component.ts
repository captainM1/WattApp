import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
//import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-consumer',
  templateUrl: './add-consumer.component.html',
  styleUrls: ['./add-consumer.component.css']
})
export class AddConsumerComponent {
  submitted = false;
  addConsumerForm!: FormGroup;
  toggle2Checked = false;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private messageService: MessageService,
    private authService: AuthService
  ){}
  manufacturers: any[] = [];
  selectedManufacturer?: string;
  devices: any[] = [];
  selectedDeviceID?: string;

  ngOnInit(): void {
    this.addConsumerForm = this.fb.group({
      'mac-address': ['', Validators.required]
    });
    this.authService.getManufacturersConsumer().subscribe((result) => {
      this.manufacturers = result;
    });
  }

  onManufacturerChanged() {
    this.authService.getDevicesForManufacturer(this.selectedManufacturer, '77CBC929-1CF2-4750-900A-164DE4ABE28B').subscribe((result) => {
      this.devices = result;
    });
  }

  onDeviceSelectionChange(deviceID: string) {
    this.selectedDeviceID = deviceID;
  }

  onSubmit(){
    this.submitted = true;    
    if(this.addConsumerForm.valid){
      //OVO TREBA DA SE IZMENI JER NE ZNAM KAKO FUNKCIONISE SVE OVO
      //this.authService.addNewDevice(this.selectedDeviceID,this.addConsumerForm.get('mac-address')?.value)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have added new device' });
      this.router.navigate(['my-devices']);
      return;
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error adding device', detail: 'Try again' });
      this.router.navigate(['addDevice'])
    }
  }
  
}
