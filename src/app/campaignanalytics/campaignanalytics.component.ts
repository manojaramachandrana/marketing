import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

interface TableData {
  date: string;
  homepage: number;
  lylregister?: number;
}

@Component({
  selector: 'app-campaignanalytics',
  templateUrl: './campaignanalytics.component.html',
  styleUrls: ['./campaignanalytics.component.css']
})
export class CampaignanalyticsComponent implements OnInit {

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

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) {
    this.firestore.collection('lylregistration').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();

        const utmCampaign = this.extractUTMParam(element['url'] || 'NoURL', 'utm_campaign');

        if (element['entrydata'] != undefined && element['event'] == 'lylregistration' && utmCampaign != undefined) {

          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);

          this.outputTableStructure[utmCampaign] = this.outputTableStructure[utmCampaign] || {
            count: 0,
            dates: {},
            countattended: 0,
            dateattended: {}
          };

          this.outputTableStructure[utmCampaign].count += 1;

          this.outputTableStructure[utmCampaign].dates[datestring] = 
            this.outputTableStructure[utmCampaign].dates[datestring] || [];

          this.outputTableStructure[utmCampaign].dates[datestring].push({
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

      // Fetch 'lylwebinarattended' collection and compare emails
      this.firestore.collection('lylwebinarattended').get().toPromise().then(webinarSnap => {
        webinarSnap.docs.forEach((webinarDoc: any) => {
          const webinarElement = webinarDoc.data();

          // Compare emails from 'lylregistration' dates[] with 'lylwebinarattended' emails
          Object.keys(this.outputTableStructure).forEach(utmCampaign => {
            const dates = this.outputTableStructure[utmCampaign].dates;

            Object.keys(dates).forEach(date => {
              dates[date].forEach((registration: any) => {
                if (registration.email === webinarElement.email) {
                  // If emails match, push the webinar data into dateattended[]
                  this.outputTableStructure[utmCampaign].countattended += 1;

                  this.outputTableStructure[utmCampaign].dateattended[date] = 
                    this.outputTableStructure[utmCampaign].dateattended[date] || [];

                  this.outputTableStructure[utmCampaign].dateattended[date].push({
                    name: webinarElement.name,
                    email: webinarElement.email,
                    phone: webinarElement.phone,
                    date: new Date(webinarElement.entrydate.toDate()).toISOString().substring(0, 10)
                  });
                }
              });
            });
          });
        });

        console.log('Updated outputTableStructure with dateattended:', this.outputTableStructure);
        this.ngAfterViewInit();
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.tableData.sort();
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

  ngOnInit(): void {
  }

}
