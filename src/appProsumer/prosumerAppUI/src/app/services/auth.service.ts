import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from "ngx-cookie-service"
import { newDeviceDTO } from 'src/app/models/newDeviceDTO'
import jwt_decode from 'jwt-decode';
import { decode } from 'jsonwebtoken';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  decoded! : Token;
  constructor(private http: HttpClient, private router:Router, private cookie: CookieService) { }

  login(email : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/User/signin", {
      email : email,
      password : password
    })
  }

  register(firstName: string, lastName: string, email : string,  address: string, phoneNumber : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/User/signup", {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      address: address,
      email: email,
      password: password
    })
  }

  validateJwt(token : string) : Observable<boolean>{
    var headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http.post<boolean>(environment.apiUrl + "/api/User/validate-token", {}, {
      headers : headers
    });
  }
  getData(){
    return this.http.get<any>(environment.apiUrl +"/api/User/username", { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getDeviceData(){
    return this.http.get<any>(`${environment.apiUrl}/api/Device/devices/info`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getToken() {
    
    const jwtToken = this.cookie.get('jwtToken');
     const decoded :any = jwt_decode(jwtToken);
     return decoded.unique_name;
  }

  signOut(){
    this.cookie.delete('jwtToken');
  }
  
}
