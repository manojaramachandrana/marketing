import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-campaignanalytics-dialog',
  templateUrl: './campaignanalytics-dialog.component.html',
  styleUrls: ['./campaignanalytics-dialog.component.css']
})
export class CampaignanalyticsDialogComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'date']; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { conversionData: any[] },  
    private dialogRef: MatDialogRef<CampaignanalyticsDialogComponent>
  ) { }
  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();  
  }

  exportexcel(): void {
    TableUtil.exportToExcel("exampleTable");
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
