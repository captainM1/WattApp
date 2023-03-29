import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Device } from '../../models/device.model';
import { Storage } from '../../models/storage.model';
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

  groups: any[] = [];
  selectedGroup!: string;

  manufacturers: any[] = [];
  selectedManufacturerId: any;
  devices: any[] = [];
  selectedDevice: any;

  selectedOption = 'consumer';
  addProducerForm!: FormGroup;
  addStorageForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private http : HttpClient,
    //private toast : NgToastService
    private messageService: MessageService
  ){}

  addConsumerForm: FormGroup = this.fb.group({
    manufacturer: ['', Validators.required]
  });

  ngOnInit() {
    this.http.get<any[]>(environment.apiUrl + '/api/Device/manufacturers')
      .subscribe(data => {
        this.manufacturers = data;
      });

    this.http.get<any[]>(environment.apiUrl + '/api/Device/groups')
      .subscribe(groups => this.groups = groups);
  }

  onGroupSelected(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedGroup = selectElement.value;
    console.log(this.selectedGroup);
  }

  onManufacturerChange(event: any) {
    const manSelect = event.target as HTMLSelectElement;
    this.selectedManufacturerId = manSelect.value;
    console.log(this.selectedManufacturerId);
  
    if (!this.selectedManufacturerId) {
      console.log('No manufacturer selected');
      return;
    }
  
    this.http.get<any[]>(`${environment.apiUrl}/api/Device/manufacturer/${this.selectedManufacturerId}`)
      .subscribe({
        next: data => {
          console.log(data);
          this.devices = data;
        },
        error: err => {
          console.error(err);
        }
      });
  }
  

  onDeviceChange(event: any){
    const deviceSelect = event.target as HTMLSelectElement;
    this.selectedDevice = deviceSelect.value;
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
    const formData = {
      manufacturerId: this.selectedManufacturerId.id,
      deviceId: this.selectedDevice.id
    };
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
    else if(this.showProducer){
      const formData = this.addProducerForm.value;

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
    else{
      const formData = this.addStorageForm.value;

      const device: Storage = {
        name: formData.name,
        manufacturer: formData.manufacturer,
        batteryCapacity: formData.batteryCapacity,
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