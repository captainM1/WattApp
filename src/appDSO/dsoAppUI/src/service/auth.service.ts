import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  getCoords():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/User/coordinatesForEveryUser");
  }

  getPagination(pageNumber : number, pageSize : number) : Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/User/users", {
      params: {
        pageSize : pageSize,
        pageNumber : pageNumber
      }
    })
  }

  getCoordsByUserID(id : string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/User/coordinates/"+id);
  }
  // getDeviceData(){
  //   return this.http.get<any>(`${environment.apiUrl}/api/Device/devices/info`, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) });
  // }


  getDevices(userID: string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Device/devices/info"+userID);
  }

  getUserPowerUsageByID(userID : string){

    return this.http.get<any>(environment.apiUrl+ "/api/PowerUsage/power-usage/currentUsageUser/summary/"+userID);
  }

  getDevicesInfoByID(deviceID : string){
    return this.http.get<any>(environment.apiUrl + "/api/Device/devices/info/"+deviceID);
  }
}
