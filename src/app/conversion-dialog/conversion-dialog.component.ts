import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-conversion-dialog',
  templateUrl: './conversion-dialog.component.html',
  styleUrls: ['./conversion-dialog.component.css']
})
export class ConversionDialogComponent implements OnInit {
  displayedColumns: string[] = [ 'name', 'email','phone', 'daydifference', 'createddate', 'converteddate', 'url'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConversionDialogComponent>) {}

  ngOnInit(): void {
  }
  onClose(): void {
    this.dialogRef.close();
  }

}
