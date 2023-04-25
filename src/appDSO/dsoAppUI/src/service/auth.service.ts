import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import { Info } from 'models/User';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookie:CookieService
  ) { }

  getCoords():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/api/User/coordinatesForEveryUser");
  }

  login(email : string, password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/Dispatcher/signin", {
      email : email,
      password : password
    })
  }

  register(username: string, role:string,email: string,password : string) : Observable<string>{
    return this.http.post<string>(environment.apiUrl + "/api/Dispatcher/signup", {
      UserName: username,
      Role: role,
      Email : email,
      password: password
    })
  }
  
  getFullToken() {
    const jwtToken = this.cookie.get('jwtToken');
    return jwtToken;
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
    return this.http.get(environment.apiUrl + '/api/PowerUsage/power-usage/current/device/'+deviceID);
  }

  
  currentProcustionSystem() : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/current-production/system");
  }

  currentConsumptionSystem() : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/current-consumption/system");
  }

  prevMonthConsumptionSystem() : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/consumption/system");
  }

  nextMonthConsumtionSystem() : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/consumption/system");
  }

  eachDevicePrevMonth():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/consumption/each-device");
  }

  prevMonthProductionSystem():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/previousMonth/production/system");
  }

  nextMonthProductionSystem():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/PowerUsage/power-usage/nextMonth/production/system");
  }

  AllDevices():Observable<any>{
    return this.http.get(environment.apiUrl + "/api/Device/devices/info");
  }

  device(deviceID : any) : Observable<any>{
    return this.http.get(environment.apiUrl + "/api/Device/devices/info/"+ deviceID);
  }

  // popup
  getUserInformation(id : string):Observable<any>{
    return this.http.get(environment.apiUrl + '/api/User/users/' + id);
  }
}
