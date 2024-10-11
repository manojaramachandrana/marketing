import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-leadconv-dialog',
  templateUrl: './leadconv-dialog.component.html',
  styleUrls: ['./leadconv-dialog.component.css']
})
export class LeadconvDialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone','date', 'url'];  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { conversionData: any[] },  
    private dialogRef: MatDialogRef<LeadconvDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();  
  }

  exportexcel(): void {
    TableUtil.exportToExcel("exampleTable");
  }

  extractUTMParam(url: string, param: string): string {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(param) || 'N/A'; 
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