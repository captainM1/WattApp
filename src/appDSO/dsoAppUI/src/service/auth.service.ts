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


  getWeather():Observable<any>{
    return this.http.get<any>('https://api.open-meteo.com/v1/forecast?latitude=44.02&longitude=20.91&hourly=temperature_2m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto');
  }

  getUserNumber(){
    return this.http.get(environment.apiUrl+'/api/User/userNumber');
  }

  getAllUserInfo(){
    return this.http.get(environment.apiUrl + '/api/User/allUserInfo')
  }

  getDeviceInfoUserByID(userID : any){
    return this.http.get(environment.apiUrl + '/api/Device/devices/info/user/'+userID);
  }

  getPowerUsageToday(deviceID: any) :Observable<any>{
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/today/'+deviceID);
  }

  getPowerUsagePreviousMonthSummary() :Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/system");
  }
  getPowerUsagePreviousMonthEveryDayUsage():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/every-day-usage")
  }

  getPowerUsageNextMonthSummary():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/system");
  }

  getPowerUsageNextMonthEveryDay():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/every-day-usage")
  }

  getPowerUsagePreviousMonthEachDevice() : Observable<any>{
    return this.http.get(environment.apiUrl+"/api/PowerUsage/power-usage/previousMonth/each-device");
  }

  getPowerUsageNextMonthEachDevice() : Observable<any>{
    return this.http.get(environment.apiUrl+"/api/PowerUsage/power-usage/nextMonth/each-device");
  }

  getPowerUsageCurretDay():Observable<any>{
    return this.http.get(environment.apiUrl+'/api/PowerUsage/power-usage/currentDay/system');
  }

  getPowerUsageCurrentHour():Observable<any>{
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/currentHour/system');
  }

  getPowerUsageCurrentSystem():Observable<any>{
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/current/system');
  }

  getPrevious24DevicePerHour(deviceID : string):Observable<any>
  {
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/Previous24h/device-usage_per_hour/'+deviceID);
  }

  getPreviousMonth(userid : any):Observable<any>{
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/nextMonth/user-every-day-device-usage/'+userid);
  }



  // popup
  getUserInformation(id : string):Observable<any>{
    return this.http.get(environment.apiUrl + '/api/User/users/' + id);
  }
}
