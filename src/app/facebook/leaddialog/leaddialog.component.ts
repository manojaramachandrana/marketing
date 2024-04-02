import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FbadsdataComponent } from 'src/app/fbadsdata/fbadsdata.component';

@Component({
  selector: 'app-leaddialog',
  templateUrl: './leaddialog.component.html',
  styleUrls: ['./leaddialog.component.css'],
})
export class LeaddialogComponent {

  last: boolean = false;
  leads: any[] = []; 

  constructor(
    public dialogRef: MatDialogRef<LeaddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: AngularFirestore
  ) {
    //console.log('Data received in LeadDialogComponent:', data);

    this.firestore.collection('leads').valueChanges().subscribe((leadsData: any) => {
      this.leads = leadsData;
    });
  }

  isLeadMatching(entry: any): boolean {
    return this.leads.some(lead => lead.name === entry.leadname || lead.email === entry.email);
  }

  getJourneyName(entry: any): string {
    const matchingLead = this.leads.find(lead => lead.name === entry.leadname && lead.email === entry.email);
    return matchingLead ? matchingLead.journeyname : '';
  }

  getCreatedDate(entry: any): string {
    const matchingLead = this.leads.find(lead => lead.name === entry.leadname && lead.email === entry.email);

    if (matchingLead && matchingLead.converteddate) {
      const timestamp = matchingLead.converteddate;
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
      
      const formattedDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
      
      return formattedDate;
    }

    return '';
  }

  // pad single-digit numbers with zero
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
