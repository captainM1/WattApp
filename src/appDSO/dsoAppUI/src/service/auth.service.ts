import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import { Info } from 'models/User';
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


  getDevices(userID: string):Observable<Info>{
    return this.http.get<Info>(environment.apiUrl + "/api/Device/devices/info/"+userID);
  }

  getUserPowerUsageByID(userID : string){
    return this.http.get<any>(environment.apiUrl+ "/api/PowerUsage/power-usage/currentUsageUser/summary/"+userID);
  }

  getDevicesInfoByID(deviceID : string){
    return this.http.get<any>(environment.apiUrl + "/api/Device/devices/info/"+deviceID);
  }

  getDeviceGroup():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Device/groups");
    
  }

  getDeviceManifactureByGroup(groupID : string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Device/manufacturers/" + groupID);
  }

  getDeviceManifaturers():Observable<any>{
    return this.http.get<any>(environment.apiUrl + '/api/Device/manufacturers');
  }

  getDeviceGroupManufacturer(groupID :string, manufID: string):Observable<any>{
    return this.http.get<any>(environment.apiUrl+ "/api/Device/"+groupID+"/"+manufID);
  }

  getDeviceGroupID(groupID: string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/Device/groups/"+groupID);
  }


  getWeather(location : string){
  //  https://api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
    return this.http.get('https://api.openweathermap.org/data/2.5/weather?q=Kragujevac&appid={754ab1f38f76a12c771ff8bd8c2f9cdb}')
  }
}
