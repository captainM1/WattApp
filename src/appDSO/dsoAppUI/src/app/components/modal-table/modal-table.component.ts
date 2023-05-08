import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
  styleUrls: ['./modal-table.component.css']
})
export class ModalTableComponent {

  constructor(
    public dialogRef : MatDialogRef<ModalTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){}

  onClose(){
    this.dialogRef.close();
  }
}
