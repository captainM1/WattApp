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
  @Input() message!: string;
  @Input() time!: string;
  @Input() type!: string;

  showModal = false;

  open() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }
}
