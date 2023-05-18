import { Component, Input, ViewChild } from '@angular/core';
import { Defaults } from 'chart.js/dist/core/core.defaults';
import { TableExport } from 'tableexport';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
  styleUrls: ['./modal-table.component.css']
})
export class ModalTableComponent {
  @ViewChild('tableTable')
  table!: TableExport;
  constructor(
  ){}

  @Input() data:any;
  @Input() message!: string;
  @Input() time!: string;
  @Input() type!: string;

  tableExport!:any;
  tablee!:any;
  sheetName!:string;
  exportToExcel(): void {
    const worksheet = XLSX.utils.table_to_sheet(document.querySelector('#tableTable'));
    const workbook = XLSX.utils.book_new();
   
    
    this.sheetName= 'power consumption and production.xlsx';
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   
    saveAs(blob, 'this.sheetName.xlsx');
    
  }
}