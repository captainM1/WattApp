import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // static validationPattern(email: string) : boolean{
  //   const pattern : RegExp = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
  //   return pattern.test(email)
  // }

  // static validationEmptyEmail(email: string) : boolean{
  //   if(email == ''){
  //     return false;
  //   }
  //   return true;
  // }

 
}
