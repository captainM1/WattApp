import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient, private cookie: CookieService, private auth: AuthService) { }
  userId: any = this.auth.getToken();

  getShareInfo(){
    return this.http.get<any>(`${environment.apiUrl}/api/User/DSO-has-control/${this.userId}`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  }

  allowAccessToInformation(allowAccess: boolean) {
    const body = { allowAccess };
    return this.http.post(`${environment.apiUrl}/allowAccessToInformation`, body);
  }

  allowControlConsumptionTime(allowControl: boolean) {
    const body = { allowControl };
    return this.http.post(`${environment.apiUrl}/allowControlConsumptionTime`, body);
  }

  

}
