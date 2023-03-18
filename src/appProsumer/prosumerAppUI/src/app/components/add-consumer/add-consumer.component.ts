import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

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
    private toast : NgToastService
  ){}

  onSubmit(){
    this.submitted = true;
    if(this.addConsumerForm.valid){
      this.toast.success({detail:"Success", summary: "Adding device successful!", duration:3000});
      this.router.navigate(['home']);
      return;
    }else{
      this.toast.error({detail:"Error", summary:"Something went wrong!", duration:3000 })
      this.router.navigate(['addDevice'])
    }

  }
}
