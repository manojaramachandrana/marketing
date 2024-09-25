import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-conversion-dialog',
  templateUrl: './conversion-dialog.component.html',
  styleUrls: ['./conversion-dialog.component.css']
})
export class ConversionDialogComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'email','phone','product', 'daydifference', 'createddate', 'converteddate', 'url'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConversionDialogComponent>) {}

  ngOnInit(): void {
  }

  extractUTMParam(url: string, param: string): string {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(param) || 'N/A'; 
  }
  
  
  onClose(): void {
    this.dialogRef.close();
  }
 
}
