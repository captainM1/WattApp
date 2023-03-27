import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
//import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-consumer',
  templateUrl: './add-consumer.component.html',
  styleUrls: ['./add-consumer.component.css']
})
export class AddConsumerComponent {
  submitted = false;
  addConsumerForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private messageService: MessageService
  ){}

  onSubmit(){
    this.submitted = true;
    if(this.addConsumerForm.valid){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have added new device' });
      //this.toast.success({detail:"Success", summary: "Adding device successful!", duration:3000});
      this.router.navigate(['home']);
      return;
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error adding device', detail: 'Try again' });
      this.router.navigate(['addDevice'])
    }

  }
}
