import { Component } from '@angular/core';

@Component({
  selector: 'app-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.css'],
  template: `
    <div [style.width]="40%" [style.height]="70%">
      <app-my-devices></app-my-devices>
    </div>
  `,
})
export class MyDevicesComponent {

}
