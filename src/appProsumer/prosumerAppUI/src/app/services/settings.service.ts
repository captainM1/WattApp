import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient, private cookie: CookieService, private auth: AuthService) { }
  userId: any = this.auth.getToken();
  role: any = this.auth.getRole();

  getShareInfo(){
    return this.http.get<any>(`${environment.apiUrl}/api/User/user-shares-with-DSO/${this.userId}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  updateUserDataSharing(allowAccess: boolean): void {
    const apiUrl = `${environment.apiUrl}/api/User/update-user-data-sharing-permission/${this.userId}`;
    const requestBody = { sharesDataWithDso: allowAccess };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.cookie.get('jwtToken')}`
    });
  
    this.http.post(apiUrl, requestBody, { headers }).subscribe(
      (response) => {
        console.log('User data sharing permission updated:', response);
      },
      (error) => {
        console.error('Error updating user data sharing permission:', error);
      }
    );
  } 

  getControlInfo(deviceId: string){
    return this.http.get<any>(`${environment.apiUrl}/api/Device/DSO-has-control/${deviceId}`, {});
  }

  updateDeviceControl(allowAccess: boolean): void {
  } 

  sendRequest(){
    return this.http.post<any>(`${environment.apiUrl}/api/User/send-request-to-dso/${this.userId}`, {});
  }
  cancelRequest(){
    return this.http.post<any>(`${environment.apiUrl}/api/User/remove-request-to-dso/${this.userId}`,{});
  }
  disconnectDSO(){
    return this.http.post<any>(`${environment.apiUrl}/api/User/disconnect-from-dso/${this.userId}`,{});
  }
  allowAccessToInformation(allowAccess: boolean) {
    const body = { allowAccess };
    return this.http.post(`${environment.apiUrl}/api/User/update-user-data-sharing-permission/${this.userId}`, body);
  }

  allowControlConsumptionTime(allowControl: boolean) {
    const body = { allowControl };
    return this.http.post(`${environment.apiUrl}/allowControlConsumptionTime`, body);
  }
  alreadyHasReq(){
    return this.http.get(`${environment.apiUrl}/api/User/user-allready-applied-to-DSO/${this.userId}`);
  }

  statusOfReq():Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/User/status-of-application/${this.userId}`);
  }
  

}
