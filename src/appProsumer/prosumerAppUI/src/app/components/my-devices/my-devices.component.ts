import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.css']
})
export class MyDevicesComponent implements OnInit {
  devices: any;
  deviceToday: {[key: string]: any} = {};
  searchName: string = '';

  @ViewChild('myTable') myTable!: ElementRef;

  constructor(
    private auth: AuthService,
    private cookie: CookieService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.getDeviceData().subscribe(
      (data) => {
        console.log(data);
        const deviceObservables = data.map((device: any) => {
          return this.auth.isOn(device.deviceId).pipe(
            tap((isOn: boolean) => {
              device.isToggled = isOn;
            }),
            catchError((error) => {
              device.isToggled = false;
              return of(null);
            })
          );
        });

        forkJoin(deviceObservables).subscribe(
          () => {
            this.devices = data;
          },
          (error) => {
            console.log(error);
          }
        );

        this.devices.forEach((device: any) => {
          this.http
            .get<any[]>(
              `${environment.apiUrl}/api/PowerUsage/power-usage/current/device/${device.deviceId}`,
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('jwtToken')}`) }
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.deviceToday[device.deviceId] = data;
              },
              (error) => {
                this.deviceToday[device.deviceId] = 0;
              }
            );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }


  exportToExcel(): void {
    const tableData = this.myTable.nativeElement.cloneNode(true);
    const columnToRemoveIndex = 0;


    const rows = tableData.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      if (cells.length > columnToRemoveIndex) {
        cells[columnToRemoveIndex].remove();
      }
    }


    const headerRow = tableData.getElementsByTagName('tr')[0];
    const headerCell = headerRow.getElementsByTagName('th')[columnToRemoveIndex];
    if (headerCell) {
      headerCell.remove();
    }

    const worksheet = XLSX.utils.table_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'devices.xlsx');
  }


  changeState(id:any){
    this.auth.changeState(id).subscribe(
      Response => console.log("Response")
    );
  }
}
