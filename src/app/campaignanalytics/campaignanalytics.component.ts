import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { SalesdialogComponent } from '../salesdialog/salesdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { campaign } from 'google-ads-api/build/src/protos/autogen/resourceNames';
import { CampaignanalyticsDialogComponent } from '../campaignanalytics-dialog/campaignanalytics-dialog.component';

interface TableData {
  campaign: string;
  count: number;
  countAttended?: number;
}

@Component({
  selector: 'app-campaignanalytics',
  templateUrl: './campaignanalytics.component.html',
  styleUrls: ['./campaignanalytics.component.css']
})
export class CampaignanalyticsComponent implements OnInit {
  displayedColumns: string[] = ['lylreg','lylregistration','lylattended','lylapplied'];

  data: any[];
  dataSource = new MatTableDataSource<TableData>();
  isSearchClicked = false;
  selectedStartDate!: Date | null;
  selectedEndDate!: Date | null;
  form!: FormGroup;
  fileName = 'ExportExcel.xlsx';
  maplylregistration: object = {};
  selectedSection: string = 'other';
  pageSize: number = 10;
  standalone: true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData: any[] = [];
  outputTableStructure: any = {};

  entrySubscriptiion: Subscription = new Subscription;

  constructor(private firestore: AngularFirestore, private fb: FormBuilder,private dialog : MatDialog) {
    this.firestore.collection('lylregistration').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();

        const utmCampaign = this.extractUTMParam(element['url'] || 'NoURL', 'utm_campaign');

        if (element['entrydata'] != undefined && element['event'] == 'lylregistration' && utmCampaign != undefined) {

          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);

          this.outputTableStructure[utmCampaign] = this.outputTableStructure[utmCampaign] || {
            // campaign: utmCampaign,
            count: 0,
            dates: [],
            countattended: 0,
            dateattended: [],
            countapplied: 0,
            dateapplied: []
          };

          this.outputTableStructure[utmCampaign].count += 1;

          this.outputTableStructure[utmCampaign]['dates'] = 
            this.outputTableStructure[utmCampaign]['dates'] || [];

          this.outputTableStructure[utmCampaign]['dates'].push({
            name: element['name'],
            email: element['email'],
            phone: element['phone'],
            date: datestring
          });

          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });

      // Fetching from 'lylwebinarattended' collection
this.firestore.collection('lylwebinarattended').get().toPromise().then(webinarSnap => {
  webinarSnap.docs.forEach((webinarDoc: any) => {
    const webinarElement = webinarDoc.data();
    
    Object.keys(this.outputTableStructure).forEach(utmCampaign => {
      const dates = this.outputTableStructure[utmCampaign]['dates'];
      
      dates.forEach((registration: any) => {
        const webinaremail = webinarElement['email'].trim();
        if (registration.email === webinaremail) {
          this.outputTableStructure[utmCampaign].countattended += 1;
          
          // Initialize 'datesattended' if not already initialized
          this.outputTableStructure[utmCampaign]['datesattended'] =
            this.outputTableStructure[utmCampaign]['datesattended'] || [];
          
          // Push the attended webinar details
          this.outputTableStructure[utmCampaign]['datesattended'].push({
            name: webinarElement.name,
            email: webinarElement.email,
            phone: webinarElement.phone,
            date: new Date(webinarElement.entrydate.toDate()).toISOString().substring(0, 10)
          });
        }
      });
    });
  });

  // Call ngAfterViewInit after processing 'lylwebinarattended' data
  this.ngAfterViewInit();
});

this.firestore.collection('lylapplied').get().toPromise().then(webinarSnap => {
  webinarSnap.docs.forEach((webinarDoc: any) => {
    const webinarElement1 = webinarDoc.data();
    
    Object.keys(this.outputTableStructure).forEach(utmCampaign => {
      // Ensure that 'datesattended' exists and is an array
      const dateAttended = this.outputTableStructure[utmCampaign]['datesattended'] || [];
      
      // Initialize 'countapplied' and 'dateapplied' if not already initialized
      this.outputTableStructure[utmCampaign].countapplied = 
        this.outputTableStructure[utmCampaign].countapplied || 0;
      
      this.outputTableStructure[utmCampaign].dateapplied = 
        this.outputTableStructure[utmCampaign].dateapplied || [];
      
      dateAttended.forEach((registration: any) => {
        const webinaremail = webinarElement1['email'].trim();
        const registrationemail = registration.email.trim();
        
        if (registrationemail === webinaremail) {
          this.outputTableStructure[utmCampaign].countapplied += 1;
          
          this.outputTableStructure[utmCampaign]['dateapplied'].push({
            name: webinarElement1.name,
            email: webinarElement1.email,
            phone: webinarElement1.phone,
            date: new Date(webinarElement1.entrydate.toDate()).toISOString().substring(0, 10)
          });
        }
      });
    });
  });

  console.log('Updated outputTableStructure with dateapplied:', this.outputTableStructure);
  this.ngAfterViewInit();
}).catch(error => {
  console.error('Error fetching data from Firestore:', error);
});

      
    });
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.data = this.tableData.sort();
  // }

  ngAfterViewInit() {
    const tableArray = Object.keys(this.outputTableStructure).map(utmCampaign => {
      return {
        campaign: utmCampaign,
        count: this.outputTableStructure[utmCampaign].count,
        countattended: this.outputTableStructure[utmCampaign].countattended,
        countapplied: this.outputTableStructure[utmCampaign].countapplied,
        dates: this.outputTableStructure[utmCampaign].dates,
        datesattended: this.outputTableStructure[utmCampaign].datesattended,
        dateapplied: this.outputTableStructure[utmCampaign].dateapplied,
      };
    });
  
    tableArray.sort((a, b) => b.count - a.count);
  
    this.dataSource.data = tableArray;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  

  extractUTMParam(url: string, param: string): string {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return url;
    }

    try {
      const urlObject = new URL(url);
      const urlParams = new URLSearchParams(urlObject.search);
      const utmValue = urlParams.get(param);

      if (utmValue && utmValue !== 'N/A') {
        return utmValue;
      }

      const pathParts = urlObject.pathname.split('/').filter(Boolean);
      return pathParts.length > 0 ? pathParts[pathParts.length - 1] : url;

    } catch (error) {
      return 'Invalid URL';
    }
  }
 

  onRowClick(row: any, conversion: string): void {
    console.log('Row clicked', row); 
    console.log('row',row.dates) 
    let conversionData = [];
    
    if ( conversion === 'lylregistered') {
      if (row.dates) conversionData = conversionData.concat(row.dates);
    } else if ( conversion === 'lylattended') {
      if (row.datesattended) conversionData = conversionData.concat(row.datesattended);
    }else if ( conversion === 'lylapplied') {
      if (row.dateapplied) conversionData = conversionData.concat(row.dateapplied);
    }
    
    this.dialog.open(CampaignanalyticsDialogComponent, {
      data: { conversionData }, 
      width: '80%',
      height: '80%'
    });
  }

  getFormattedDate(timestamp): string {
    const date = new Date(timestamp.toMillis());
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });

  }

  onSubmit() {
    if (this.form.value.daterange && this.form.value.daterange.start && this.form.value.daterange.end) {
      this.selectedStartDate = this.form.value.daterange.start;
      this.selectedEndDate = this.form.value.daterange.end;
      this.isSearchClicked = true; 
      this.filterDataByDateRange();
    }
  }

  filterDataByDateRange() {
    if (this.selectedStartDate && this.selectedEndDate) {
      console.log(this.selectedStartDate, this.selectedEndDate);
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      endDate.setDate(endDate.getDate() + 1); // To include the end date
      console.log(startDate, endDate);
  
      // Filter the data based on the selected date range
      const filteredData = Object.keys(this.outputTableStructure)
        .map(utmCampaign => {
          const row = this.outputTableStructure[utmCampaign];
          const hasValidDate = row.dates.some((dateObj: any) => {
            const date = new Date(dateObj.date);
            return date >= startDate && date < endDate;
          });
  
          // Return the row if it has at least one date in the range
          return hasValidDate ? {
            campaign: utmCampaign,
            count: row.count,
            countattended: row.countattended,
            countapplied: row.countapplied,
            dates: row.dates,
            datesattended: row.datesattended,
            dateapplied: row.dateapplied,
          } : null;
        })
        .filter(row => row !== null); // Remove null rows
  
      this.dataSource.data = filteredData; // Update the data source
    }
  }
  

}
