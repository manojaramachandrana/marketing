import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-facebook-data',
  templateUrl: './facebook-data.component.html',
  styleUrls: ['./facebook-data.component.css']
})

export class FacebookDataComponent implements OnInit {
  displayedColumns: string[] = ['date'];
  dataSource = new MatTableDataSource< { date: string } >(); 
  
  constructor(private firestore: AngularFirestore) {
    this.fetchAndProcessEntries();
  }

  ngOnInit() {  }

  fetchAndProcessEntries() {
    const startDate = new Date('2024-03-10');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const campaigns = [
      { campaignname: 'adsinsight'},
      { campaignname: 'entries' },
      { campaignname: 'leads' },
      { campaignname: 'lylregistration' },
    ];
  }
  getDifferenceInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; 
    const startDateTime = startDate.getTime();
    const endDateTime = endDate.getTime();
    return Math.round(Math.abs((endDateTime - startDateTime) / oneDay));
  }
  
  getDateFormatted(index: number, startDate: Date): string {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return this.formatDate(date);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
