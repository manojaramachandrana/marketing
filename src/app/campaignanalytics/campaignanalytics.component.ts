import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';
import { timestamp } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

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
  maplylregistration : object = {}
  selectedSection: string = 'other';
  pageSize: number = 10;
  standalone: true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData:any [] = [];
  outputTableStructure:any = {}

  entrySubscriptiion: Subscription = new Subscription;

  constructor( private firestore:AngularFirestore,private fb: FormBuilder,private dialog : MatDialog ) {
    this.firestore.collection('lylregistration').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
    
        const utmCampaign = this.extractUTMParam(element['url']|| 'NoURL', 'utm_campaign');
    
        if (element['entrydata'] != undefined && element['event'] == 'lylregistration' && utmCampaign != undefined) {
    
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);  
    
          this.outputTableStructure[utmCampaign] = this.outputTableStructure[utmCampaign] || {
            count: 0,
            dates: {}
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
      console.log('table',this.outputTableStructure)
      this.ngAfterViewInit();
    });
    
   }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.tableData).sort();
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
