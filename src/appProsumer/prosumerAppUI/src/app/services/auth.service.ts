import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7234/api/User/";
  constructor(private http: HttpClient) { }

  signUp(userObj:any)
  {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj:any)
  {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
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
