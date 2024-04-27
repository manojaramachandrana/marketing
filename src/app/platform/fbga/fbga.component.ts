import { Component, OnInit, ViewChild,ElementRef, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { map, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';

interface MyData {
  date: number;
  homepage: number;
  lylreg: number;
  lylattended: number;
  lylcomwatch: number;
  lylapplied: number;
  loghot: number;
  superopportunity: number;
  sales: number;
  sales_total: number;
  amountreturn: number;
  spend_MM: number;
}

@Component({
  selector: 'app-fbga',
  templateUrl: './fbga.component.html',
  styleUrls: ['./fbga.component.css']
})

export class FbgaComponent implements OnInit, OnDestroy {
  selectedStartDate!: Date | null;
  selectedEndDate!: Date | null ;
  form!: FormGroup;
  sort:any;
  fileName = 'ExportExce.xlsx';
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  myDataService: any;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
      this.dataSource.sort = this.sort;
    }
  }

  displayedColumns: string[] = ['date', 'homepage', 'lylreg', 'lylattended', 'lylcomwatch', 'lylapplied', 'loghot', 'superopportunity', 'sales','sales_total','amountreturn','spend_MM']; 
  dataSource = new MatTableDataSource< { date: string, homepage: number, lylreg: number, lylattended: number, lylcomwatch: number, lylapplied:number, loghot: number, superopportunity:number, sales:number, sales_total:number, amountreturn:number,spend_MM:number }>(); 
  aggregatedData: { monthYear: string; homepageTotal: number; lylregTotal: number; salesTotal: number }[] = [];
  aggregatedColumns: string[] = ['monthYear', 'homepageTotal', 'lylregTotal', 'salesTotal'];

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form= this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
    this.fetchAndProcessEntries();
    this.fetchprocessremainingentries();
    this.split();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  split() {
    const aggregatedData: { monthYear: string; homepageTotal: number; lylregTotal: number; salesTotal: number }[] = [];
    
    this.dataSource.data.forEach(item => {
      const dateString = item.date;
      const dateParts = dateString.split('-');
      const month = dateParts[1];
      const year = dateParts[2];
      const monthYearKey = `${month}-${year}`;
  
      let existingEntry = aggregatedData.find(entry => entry.monthYear === monthYearKey);
  
      if (!existingEntry) {
        existingEntry = {
          monthYear: monthYearKey,
          homepageTotal: 0,
          lylregTotal: 0,
          salesTotal: 0
        };
        aggregatedData.push(existingEntry);
      }
  
      existingEntry.homepageTotal += (item.homepage || 0) + (item.lylreg || 0);
      existingEntry.lylregTotal += (item.lylreg || 0);
      existingEntry.salesTotal += item.sales; 
    });
    console.log('data',aggregatedData)
  
    // this.aggregatedData = aggregatedData;
    return JSON.stringify(aggregatedData, null, 2)
    
}

  exportexcel(): void {
    TableUtil.exportToExcel("exampleTable"); 
  }

  onSubmit() {
    if (this.form.value.daterange && this.form.value.daterange.start && this.form.value.daterange.end) {
      this.selectedStartDate = this.form.value.daterange.start;
      this.selectedEndDate = this.form.value.daterange.end;
      this.filterDataByDateRange();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterDataByDateRange() {
    console.log('enter', this.selectedStartDate);
    if (this.selectedStartDate && this.selectedEndDate) {
      const startDate = new Date(this.selectedStartDate); 
      const endDate = new Date(this.selectedEndDate); 
      this.dataSource.data = this.dataSource.data.filter(element => {
        const [day, month, year] = element.date.split('-').map(Number); 
        const elementDate = new Date(year, month - 1, day); 
        return elementDate >= startDate && elementDate <= endDate;
      });
    }
  }

  fetchprocessremainingentries(){
    const startDate = new Date('2024-03-1');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const campaigns = [
      { campaignname: 'lylwebinarattended'},
      { campaignname: 'lylwebcompletewatch' },
      { campaignname: 'lylapplied' },
      { campaignname: 'loghot' },
      { campaignname: 'superhotopportunities' },
      { campaignname: 'leads' },
      { campaignname: 'adsinsight'}
    ];
    campaigns.forEach(campaign => {
      this.firestore.collection<any>(campaign.campaignname, ref =>
      ref.where((campaign.campaignname === 'leads' ? 'converteddate': 'entrydate') || (campaign.campaignname === 'adsinsight' ? 'docdate':''), '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where((campaign.campaignname === 'leads' ? 'converteddate': 'entrydate') || (campaign.campaignname === 'adsinsight' ? 'docdate':''), '<=', firebase.firestore.Timestamp.fromDate(endDate))
         ).valueChanges().pipe(
          takeUntil(this.unsubscribe$),
          map(entries => {
            const countsByDate: {[key:string]: number } = {};
            entries.forEach(entry =>{
              const dateField = (campaign.campaignname === 'leads' ? 'converteddate' : 'entrydate') || (campaign.campaignname === 'adsinsight' ? 'docdate':'');
              const date = entry[dateField].toDate(); 
              const dateString = this.formatDate(date);
              countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
            });
            return {countsByDate, campaignName: campaign.campaignname};
          })
         ).subscribe(({countsByDate , campaignName})=> {
          this.populateDataSource(startDate, endDate, countsByDate, campaignName);
        });
    });
  }

  fetchAndProcessEntries() {
    const startDate = new Date('2024-03-1');
    startDate.setHours(0, 0, 0, 0);
    console.log('dateee',startDate)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const campaigns = [
      { campaignname: 'entries'},
      { campaignname: 'lylregistration' }
    ];

    campaigns.forEach(campaign => {
      this.firestore.collection<any>(campaign.campaignname, ref =>
        ref.where(campaign.campaignname === 'entries' ? 'createddate':'entrydata', '>=', firebase.firestore.Timestamp.fromDate(startDate))
           .where(campaign.campaignname === 'entries' ? 'createddate':'entrydata', '<=', firebase.firestore.Timestamp.fromDate(endDate))
      ).valueChanges().pipe(
        takeUntil(this.unsubscribe$),
        map(entries => {
          const countsByDate: { [key: string]: number } = {};
          entries.forEach(entry => {
            const dateField = campaign.campaignname === 'entries' ? 'createddate' : 'entrydata';
            const date = entry[dateField].toDate(); 
            const dateString = this.formatDate(date);
            countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
          });
          return { countsByDate, campaignName: campaign.campaignname };
        })
      ).subscribe(({ countsByDate, campaignName }) => {
        this.populateDataSource(startDate, endDate, countsByDate, campaignName);
      });
    });
  }

  async populateDataSource(startDate: Date, endDate: Date, countsByDate: { [key: string]: number }, campaignName: string) {

    const numberOfDays = this.getDifferenceInDays(startDate, endDate);

    for (let i = 0; i <= numberOfDays; i++) {
        const date = this.getDateFormatted(i, startDate);
        const count = countsByDate[date] || 0;

        const totalPurchaseValue = await this.getTotalPurchaseValueForDate(date, campaignName);
        const liquidity = await this.getamountreturn(date,campaignName)
        const spendmm = await this.getamountspend(date,campaignName)

        const existingDataIndex = this.dataSource.data.findIndex(d => d.date === date);
        if (existingDataIndex !== -1) {
            if (campaignName === 'entries') {
                this.dataSource.data[existingDataIndex]['homepage'] = count;
            } else if (campaignName === 'adsinsight') {
              this.dataSource.data[existingDataIndex]['spend_MM'] = spendmm;
            } else if (campaignName === 'lylregistration') {
                this.dataSource.data[existingDataIndex]['lylreg'] = count;
            } else if (campaignName === 'lylwebinarattended') {
                this.dataSource.data[existingDataIndex]['lylattended'] = count;
            } else if (campaignName === 'lylwebcompletewatch') {
                this.dataSource.data[existingDataIndex]['lylcomwatch'] = count;
            } else if (campaignName === 'lylapplied') {
                this.dataSource.data[existingDataIndex]['lylapplied'] = count;
            } else if (campaignName === 'loghot') {
                this.dataSource.data[existingDataIndex]['loghot'] = count;
            } else if (campaignName === 'superhotopportunities') {
                this.dataSource.data[existingDataIndex]['superopportunity'] = count;
            } else {
                this.dataSource.data[existingDataIndex]['sales'] = count;
                this.dataSource.data[existingDataIndex]['sales_total'] = totalPurchaseValue;
                this.dataSource.data[existingDataIndex]['amountreturn']= liquidity;
            }
        } else {
            const newDataItem = {
                date,homepage: campaignName === 'entries' ? count : 0,lylreg: campaignName === 'lylregistration' ? count : 0,lylattended: campaignName === 'lylwebinarattended' ? count : 0,lylcomwatch: campaignName === 'lylwebcompletewatch' ? count : 0,lylapplied: campaignName === 'lylapplied' ? count : 0,loghot: campaignName === 'loghot' ? count : 0,superopportunity: campaignName === 'superhotopportunities' ? count : 0,sales: campaignName === 'leads' ? count : 0,sales_total: campaignName === 'leads' ? totalPurchaseValue : 0, amountreturn : campaignName === 'leads' ? liquidity:0, spend_MM: campaignName === 'adsinsight' ? spendmm:0};
                this.dataSource.data.push(newDataItem);
        }
    }
    this.dataSource.data = [...this.dataSource.data];
}

calculatespend() {
  return this.dataSource.data.map(t => t.spend_MM).reduce((acc, curr) => acc + curr,0);
}
totalhomepage(){
  return this.dataSource.data.map(t => t.homepage).reduce((acc, curr) => acc + curr,0);
}
totallylreg(){
  return this.dataSource.data.map(t => t.lylreg).reduce((acc, curr) => acc + curr,0);
}
totallylattend(){
  return this.dataSource.data.map(t => t.lylattended).reduce((acc, curr) => acc + curr,0);
}
totallylcomwatch(){
  return this.dataSource.data.map(t => t.lylcomwatch).reduce((acc, curr) => acc + curr,0);
}
totallylapplied(){
  return this.dataSource.data.map(t => t.lylapplied).reduce((acc, curr) => acc + curr,0);
}
totalsales(){
  return this.dataSource.data.map(t => t.sales).reduce((acc, curr) => acc + curr,0);
}
totalsale(){
  return this.dataSource.data.map(t => t.sales_total).reduce((acc, curr) => acc + curr,0);
}
totalloghot(){
  return this.dataSource.data.map(t => t.loghot).reduce((acc, curr) => acc + curr,0);
}
totalsuperopportunity(){
  return this.dataSource.data.map(t => t.superopportunity).reduce((acc, curr) => acc + curr,0);
}
totalspend(){
  return this.dataSource.data.map(t => t.amountreturn).reduce((acc, curr) => acc + curr,0);
}
totalleads(): number {
  const totalHomepage = this.dataSource.data.reduce((total, item) => total + (item.homepage || 0), 0);
  const totalLylReg = this.dataSource.data.reduce((total, item) => total + (item.lylreg || 0), 0);
  return totalHomepage + totalLylReg;
}

async getamountreturn(date: string, campaignName: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(0, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(23, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  return new Promise<number>((resolve, reject) => {
      let liquidity = 0;
      this.firestore.collection<any>(campaignName, ref => ref.where('converteddate', '>=', startTimestamp)
          .where('converteddate', '<=', endTimestamp)
      ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
          entries.forEach(entry => {
            liquidity = liquidity + (entry.initialpayment || 0) ;
          });
          resolve(liquidity);
      }, error => {
          reject(error);
      });
  });
}

async getamountspend(date: string, campaignName: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(23, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(47, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  return new Promise<number>((resolve, reject) => {
      let spendmm = 0;
      let spendbb = 0;
      if (date === '10-03-2024') {
        spendmm = spendmm + 2952;
      }else if(date === '11-03-2024'){
        spendmm = spendmm + 3336;
      }else if(date === '12-03-2024'){
        spendmm = spendmm + 5118;
      }else if(date === '13-03-2024'){
        spendmm = spendmm + 4074;
      }else if(date === '14-03-2024'){
        spendmm = spendmm + 3270;
      }
      this.firestore.collection<any>(campaignName, ref => ref.where('docdate', '>=', startTimestamp)
          .where('docdate', '<=', endTimestamp)
      ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
          entries.forEach(entry => {
            spendmm = spendmm + (entry.amountSpend || 0) ;
          });
          resolve(spendmm);
      }, error => {
          reject(error);
      });
  });
}

  async getTotalPurchaseValueForDate(date: string, campaignName: string): Promise<number> {
    const [day, month, year] = date.split("-").map(Number);
    const dateObject = new Date(year, month - 1, day);
    dateObject.setHours(0, 0, 0, 0);
    const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
    dateObject.setHours(23, 59, 59, 999);
    const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
    return new Promise<number>((resolve, reject) => {
        let totalPurchaseValue = 0;
        this.firestore.collection<any>(campaignName, ref => ref.where('converteddate', '>=', startTimestamp)
            .where('converteddate', '<=', endTimestamp)
        ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
            entries.forEach(entry => {
                totalPurchaseValue += entry.totalpurchasevalue || 0;
            });
            resolve(totalPurchaseValue);
        }, error => {
            reject(error);
        });
    });
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