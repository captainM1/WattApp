import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
  styleUrls: ['./modal-table.component.css']
})
export class ModalTableComponent {

  constructor(
  ){}

  @Input() data:any;


  showModal = false;

  open() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }
}
