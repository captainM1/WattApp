import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient) { }

  allowAccessToInformation(allowAccess: boolean) {
    const body = { allowAccess };
    return this.http.post(`${environment.apiUrl}/allowAccessToInformation`, body);
  }

  allowControlConsumptionTime(allowControl: boolean) {
    const body = { allowControl };
    return this.http.post(`${environment.apiUrl}/allowControlConsumptionTime`, body);
  }

}
