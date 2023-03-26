import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-add-producer',
  templateUrl: './add-producer.component.html',
  styleUrls: ['./add-producer.component.css']
})
export class AddProducerComponent {
  submitted = false;
  addProducerForm!: FormGroup;
  toggle2Checked = false;

  constructor(
    private fb: FormBuilder, 
    private router : Router,
    private toast : NgToastService
  ){}

  onSubmit(){
    this.submitted = true;
    if(this.addProducerForm.valid){
      this.toast.success({detail:"Success", summary: "Adding device successful!", duration:3000});
      this.router.navigate(['home']);
      return;
    }else{
      this.toast.error({detail:"Error", summary:"Something went wrong!", duration:3000 })
      this.router.navigate(['addDevice'])
    }

  }
}
