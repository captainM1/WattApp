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
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/previous24Hours/consumption/user-every-day-device-usage/"+userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getDeviceInfoUserByID(userID : any){
    return this.http.get(environment.apiUrl + '/api/Device/devices/info/user/'+userID,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionPrevMonth(userID : any) : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/consumption/user-every-day-device-usage/"+userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionNextMonth(userID: any):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/consumption/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionPrev7days(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previous7Days/consumption/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionNext24Hours(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/next24Hours/consumption/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionNext7days(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/next7Days/consumption/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionPrevious24Hours(userID:any) :Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/PowerUsage/power-usage/previous24Hours/production/user-every-day-device-usage/"+userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionPrev7days(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previous7Days/production/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionPrevMonth(userID : any) : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/production/user-every-day-device-usage/"+userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionNext24Hours(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/next24Hours/production/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionNext7days(userID : string):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/next7Days/production/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getProductionNextMonth(userID: any):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/production/user-every-day-device-usage/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getConsumptionSavedEnergyMonth(userID: any):Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/user-usage-saved-energy-month/consumer/" + userID, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  getElectricityBill(userID: any, electricityRate: number):Observable<any>{
    return this.http.get(environment.apiUrl + `/api/PowerUsage/power-usage/electricityBill/LastMonth/${userID}?electricityRate=${electricityRate}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }


  putUpdateUser(userID: any, profileData:any):Observable<any>{
    return this.http.post(environment.apiUrl + `/api/User/update-user/${userID}`, profileData,{ headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }


}
