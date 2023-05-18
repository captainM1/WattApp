import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-modal-edit-profile',
  templateUrl: './modal-edit-profile.component.html',
  styleUrls: ['./modal-edit-profile.component.css']
})
export class ModalEditProfileComponent {
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() email!: string;
  @Input() id!:string;

  constructor(
    private auth : AuthService,
    private router : Router
  ){}
  
  updateDispacher(){
    const profile = {
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email
    };
    this.auth.updateDispacher(this.id, this.firstName, this.lastName, this.email).subscribe({
      next:(response:any)=>{
        console.log("SUCC", response);
        this.router.navigate(['profile']);
      },
      error:(error : any)=>{
        console.log(error);
      }

    })
  }

  


}
