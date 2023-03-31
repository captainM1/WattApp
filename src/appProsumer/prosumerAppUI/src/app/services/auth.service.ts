import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from "ngx-cookie-service"
import { newDeviceDTO } from 'src/app/models/newDeviceDTO'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(private http: HttpClient, private router:Router, private cookie: CookieService) { }

  login(email : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/User/signin", {
      email : email,
      password : password
    })
  }

  register(username: string, email : string,  address: string, phoneNumber : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/User/signup", {
      username: username,
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
    return this.cookie.get('jwtToken'); 
  }

  signOut(){
    this.cookie.delete('jwtToken');
  }
  
}
