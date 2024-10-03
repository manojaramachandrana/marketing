import { AfterViewInit,Component, OnInit,ViewChild  } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { SalesdialogComponent } from '../salesdialog/salesdialog.component';

interface CampaignData {
  campaign: string;
  count: number;
  sales: number;
  salevalue: number;
  liquidity: number;
  amountSpend: number;
  mindate: Date;
  maxdate: Date;
}

interface TableData {
  date: string;
  homepage: number;
  lylregister?: number;
}
// febyjohnson@gmail.com
// leena7384@gmal.com

@Component({
  selector: 'app-seasonalcam',
  templateUrl: './seasonalcam.component.html',
  styleUrls: ['./seasonalcam.component.css']
})
export class SeasonalcamComponent implements OnInit {

  dataSource = new MatTableDataSource<CampaignData>();
  displayedColumns: string[] = ['campaign', 'count', 'sales', 'salevalue', 'liquidity', 'amountSpend'];

  mapcampaign : object = {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData:any [] = [];
  outputTableStructure:any = {}

  constructor( private firestore:AngularFirestore,private fb: FormBuilder,private dialog : MatDialog) { 
// Campaign leads count
    this.firestore.collection('seasonalcampaign').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        
        if (element['campaign'] !== undefined) {
          let datestring = element['campaign']
    
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { campaign: "", count: 0, sales: 0, salevalue: 0, liquidity: 0, leads: []};
          this.outputTableStructure[datestring]['campaign'] = datestring;
          this.outputTableStructure[datestring]['count'] += 1;
    
          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });
      // console.log('data',this.outputTableStructure);
      this.ngAfterViewInit();
    });

    // min & max date
    this.firestore.collection('seasonalcampaign').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        
        if (element['campaign'] !== undefined) {
          let datestring = element['campaign'];
          let campaignDate = element['createddate'].toDate();
        
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { 
            campaign: "", count: 0, maxdate: campaignDate, mindate: campaignDate, amountSpend: 0 , leads: []
          };
          
          this.outputTableStructure[datestring]['campaign'] = datestring;
        
          if (!this.outputTableStructure[datestring]['maxdate'] || campaignDate > this.outputTableStructure[datestring]['maxdate']) {
            this.outputTableStructure[datestring]['maxdate'] = campaignDate;
          }
          if (!this.outputTableStructure[datestring]['mindate'] || campaignDate < this.outputTableStructure[datestring]['mindate']) {
            this.outputTableStructure[datestring]['mindate'] = campaignDate;
          }
    
          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });      
    
    }).catch(error => {
      console.error('Error fetching seasonal campaign documents:', error);
    });

    // sales count
    this.firestore.collection('seasonalcampaign').get().toPromise().then(async (snap) => {
      const campaignPromises = snap.docs.map(async (doc) => {
        const seasonCampaignElement = doc.data();
    
        if (seasonCampaignElement['campaign'] !== undefined) {
          let datestring = seasonCampaignElement['campaign'];
    
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {
            campaign: datestring,
            count: 0,
            sales: 0,
            salevalue: 0,
            liquidity: 0,
            leads: []
          };
    
          let leadsSnap = await this.firestore
            .collection('leads', (ref) => ref.where('email', '==', seasonCampaignElement['email']))
            .get()
            .toPromise();
    
          leadsSnap.docs.forEach((leadDoc) => {
            const leadElement = leadDoc.data();
    
            let purchaseDate = new firebase.firestore.Timestamp(leadElement['purchasedate']['_seconds'], leadElement['purchasedate']['_nanoseconds']).toDate();
            let campaignCreatedDate = seasonCampaignElement['createddate'].toDate();
    
            if (purchaseDate > campaignCreatedDate) {
              this.outputTableStructure[datestring]['sales'] += 1;
              this.outputTableStructure[datestring]['salevalue'] += leadElement['totalpurchasevalue'] || 0;
              this.outputTableStructure[datestring]['liquidity'] += leadElement['initialpayment'] || 0;

              if (Array.isArray(this.outputTableStructure[datestring]['leads'])) {
                this.outputTableStructure[datestring]['leads'].push({
                  name: leadElement['name'],
                  email: leadElement['email'],
                  mobile: leadElement['mobile'],
                  product: leadElement['journeyname'],
                  purchaseDate: purchaseDate,
                  totalPurchaseValue: leadElement['totalpurchasevalue'],
                  initialPayment: leadElement['initialpayment']
                });
              } else {
                console.error(`Leads is not an array or undefined for datestring: ${datestring}`);
                // console.log(this.outputTableStructure[datestring]['leads'] = [{
                //   name: leadElement['name'],
                //   email: leadElement['email'],
                //   mobile: leadElement['mobile']
                // }])
              }

              // this.outputTableStructure[datestring]['lead'].push({
              //   name: leadElement['name'],
              //   email: leadElement['email'],
              //   mobile: leadElement['mobile'],
              //   purchaseDate: purchaseDate,
              //   totalPurchaseValue: leadElement['totalpurchasevalue'],
              //   initialPayment: leadElement['initialpayment']
              // });
    
              if (!this.tableData.includes(datestring)) {
                this.tableData.push(datestring);
              }
            }
          });
        }
      });

      this.firestore.collection('adsinsight').get().toPromise().then(adsSnap => {
        adsSnap.docs.forEach((adDoc: any) => {
          const adData = adDoc.data();
          const adDocDate = adData['docdate'].toDate();
          
          const amountSpend = Number(adData['amountSpend']);
    
          if (isNaN(amountSpend)) {
            console.warn('Invalid amountSpend:', adData['amountSpend']);
            return;
          }
    
          Object.keys(this.outputTableStructure).forEach(campaignKey => {
            const campaign = this.outputTableStructure[campaignKey];
    
            if (adDocDate >= campaign.mindate && adDocDate <= campaign.maxdate) {
              campaign.amountSpend = (campaign.amountSpend || 0) + amountSpend;
            }
          });
        });
    
         console.log('Data1:', this.outputTableStructure);
        this.ngAfterViewInit();
      }).catch(error => {
        console.error('Error fetching ads insight documents:', error);
      });
    
      await Promise.all(campaignPromises);
    
       console.log('Optimized Data:', this.outputTableStructure);
      this.ngAfterViewInit();
    }).catch((error) => {
      console.error('Error getting documents:', error);
    });
    
  }

  ngAfterViewInit() {
   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.tableData).sort();
  }

  ngOnInit(): void {
  }

  openSalesDialog(campaign: string) {
    const campaignData = this.outputTableStructure[campaign];
    if (campaignData && campaignData.leads && campaignData.leads.length > 0) {
      this.dialog.open(SalesdialogComponent, {
        data: {
          leads: campaignData.leads
        }
      });
    } else {
      console.log('No leads found for this campaign.');
    }
  }
  
}


