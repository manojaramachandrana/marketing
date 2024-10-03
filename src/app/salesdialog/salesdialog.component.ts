import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-salesdialog',
  templateUrl: './salesdialog.component.html',
  styleUrls: ['./salesdialog.component.css']
})
export class SalesdialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'mobile','product', 'purchaseDate', 'totalPurchaseValue', 'initialPayment'];

  constructor( @Inject(MAT_DIALOG_DATA) public data: { leads: any[] }) { }

  ngOnInit(): void {
  }

  exportexcel(): void {
    TableUtil.exportToExcel("exampleTable");
  }

  getLeads() {
    return this.data.leads || [];
  }
}

export class TableUtil {
  static exportToExcel(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    
    if (targetTableElm) {
      let wb = XLSX.utils.table_to_book(targetTableElm, { sheet: prefix });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      console.error(`Table with id '${tableId}' not found.`);
    }
  }
}