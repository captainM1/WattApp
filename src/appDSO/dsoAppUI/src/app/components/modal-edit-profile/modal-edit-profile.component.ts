import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Info } from 'models/User';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-modal-edit-profile',
  templateUrl: './modal-edit-profile.component.html',
  styleUrls: ['./modal-edit-profile.component.css']
})
export class ModalEditProfileComponent implements OnInit{
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() email!: string;
  @Input() id!:string;
  @Input() phoneNumber!:string;
  @Input() password!:string;
  @Input() disp!:Info;
  @Output() workerUpdated  = new EventEmitter<void>();
  @ViewChild('modelEDIT') modalElementRef!: ElementRef;
  constructor(
    private auth : AuthService,
    private router : Router
  ){}
  ngOnInit(): void {
    console.log(this.disp);
    console.log(this.id);
  }
  
  updateDispacher(){
   
    const profile = {
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      phoneNumber:this.phoneNumber
    };
    this.auth.updateDispacher(this.id, this.firstName, this.lastName, this.phoneNumber, this.email).subscribe({
      next:(response:any)=>{
        this.workerUpdated.emit();
      },
      error:(error : any)=>{
        console.log(error);
      }

    })
  }

  


}
