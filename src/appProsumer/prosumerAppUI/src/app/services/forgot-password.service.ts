import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResetPassword } from '../models/resetPassword';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private baseUrl: string = environment.apiUrl + "";
  constructor(
    private http: HttpClient
  ) { }

  sendResetPasswordLink(email : string){
    return this.http.post<any>(this.baseUrl+"/../"+email,{});
  }

  resetPassword(resetPasswordObj : ResetPassword){
    return this.http.post<any>(this.baseUrl+"/..", resetPasswordObj)
  }
}
