import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {


  constructor(
    private http : HttpClient,
    private auth : AuthService,
    private cookie : CookieService) {}

  getUserByID(userID : string) : Observable<any>{
    return this.http.get<any>(environment.apiUrl + '/api/User/users/' + userID);
  }

  getAllUsers() : Observable<any>{
    return this.http.get<any>(environment.apiUrl + '/api/User/allUserInfo');
  }

  getThisUser(userID:string) : Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/User/users/${userID}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getCurrentConsumptionSummary(userID:any) :Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/currentUsageUser/consumption-summary/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getCurrentProductionSummary(userID:any) :Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/currentUsageUser/production-summary/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getAverageUserUsage(userID:any) :Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/PreviousMonth/average-user-usage/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getCurrentMostConsumes(userID:any) : Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/most-consumes/current/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getCurrentMostProduces(userID:any) : Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/most-produces/current/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionPrevious24Hours(userID:any) :Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/previous24Hours/consumption/user-every-day-device-usage/"+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getDeviceInfoUserByID(userID : any){
    return this.http.get(environment.apiUrl + '/api/Device/devices/info/user/'+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }
}
