import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router:Router) { }

  login(email : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/authenticate", {
      email : email,
      password : password
    })
  }

  register(username: string, email : string,  address: string, number : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/register", {
      username : username,
      email : email,
      address : address,
      number : number,
      password : password
    })
  }



  storeToken(tokenValue:string)
  {
    localStorage.setItem('token', tokenValue);
  }

  getToken()
  {
    return localStorage.getItem('token');
  }

  isloggedIn():boolean
  {
    return !!localStorage.getItem('token');
  }

}
