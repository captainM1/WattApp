import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Device } from '../../models/device.model';
//import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  showConsumer: boolean = true;
  showStorage: boolean = false;
  showProducer: boolean = false;
  toggle2Checked = false;

  selectedOption = 'consumer';
  addConsumerForm!: FormGroup;
  addProducerForm!: FormGroup;
  addStorageForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private http : HttpClient,
    //private toast : NgToastService
    private messageService: MessageService
  ){}

  ngOnInit() {
    this.addConsumerForm = this.fb.group({
      name: '',
      manufacturer: '',
      wattage: 0,
      macAddress: '',
      toggleButton1: false,
      toggleButton2: false
    });
  }

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


  onSubmit(){
    if(this.showConsumer){
      const formData = this.addConsumerForm.value;

      const device: Device = {
        name: formData.name,
        manufacturer: formData.manufacturer,
        wattage: formData.wattage,
        macAddress: formData.macAddress,
        collectData: formData.toggleButton1,
        controlTime: formData.toggleButton2
      };
      console.log(device);

      this.http.post(environment.apiUrl + '/devices/add-new', device)
      .subscribe(response => {
        console.log(response);
      });
    }
  }
}