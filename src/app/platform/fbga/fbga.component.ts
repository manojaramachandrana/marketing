import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { map, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';

interface MyData {
  date: string;
  homepage: number;
  lylreg: number;
  lylregfromhp: number;
  lylregnotfromhp: number;
  lylattended: number;
  lylattendedfromhp: number;
  lylattendednotfromhp: number;
  lylcomwatchfromhp: number;
  lylcomwatchnotfromhp: number;
  lylcomwatch: number;
  lylapplied: number;
  lylappliedfromhp: number;
  lylappliednotfromhp: number;
  loghot: number;
  superopportunity: number;
  sales: number;
  salesfromhp: number;
  salesnotfromhp: number;
  sales_total: number;
  sales_totalfromhp: number;
  sales_totalnotfromhp: number;
  amountreturn: number;
  amountreturnfromhp: number;
  amountreturnnotfromhp: number;
  spend_MM: number;
}

@Component({
  selector: 'app-fbga',
  templateUrl: './fbga.component.html',
  styleUrls: ['./fbga.component.css']
})
export class FbgaComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedStartDate!: Date | null;
  selectedEndDate!: Date | null;
  form!: FormGroup;
  fileName = 'ExportExcel.xlsx';
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [ 'date', 'homepage', 'lylreg', 'lylattended', 'lylcomwatch', 'lylapplied','loghot', 'superopportunity', 'sales', 'sales_total', 'amountreturn', 'spend_MM'];
  displayedColumn: string[] = [ 'date', 'homepage', 'lylreg', 'lylattended', 'lylcomwatch', 'lylapplied', 'sales', 'sales_total', 'amountreturn','spend'];
  displayedColumnlyl: string[] = [ 'date','lylreg', 'lylattended', 'lylcomwatch', 'lylapplied', 'sales', 'sales_total', 'amountreturn','spend'];
 
  dataSource = new MatTableDataSource<MyData>([]);
  selectedSection: string = 'homepage';
  loading: boolean = true;

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
    this.loadData().then(() => {
      this.loading = false;
    });
    this.fetchAndProcessEntries();
    this.fetchprocessremainingentries();
  }

  loadData(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.dataSource ;
        resolve();
      }, 7000);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  filterDataByDateRange() {
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

  fetchprocessremainingentries() {
    const startDate = new Date('2024-05-01');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const campaigns = [
      'lylwebinarattended', 'lylwebcompletewatch', 'lylapplied', 'loghot', 
      'superhotopportunities', 'leads', 'adsinsight'
    ];

    campaigns.forEach(campaign => {
      const dateField = campaign === 'leads' ? 'converteddate' : (campaign === 'adsinsight' ? 'docdate' : 'entrydate');
      this.firestore.collection<any>(campaign, ref =>
        ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
           .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
      ).valueChanges().pipe(
        takeUntil(this.unsubscribe$),
        map(entries => {
          const countsByDate: { [key: string]: number } = {};
          entries.forEach(entry => {
            const date = entry[dateField].toDate();
            const dateString = this.formatDate(date);
            countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
          });
          return { countsByDate, campaignName: campaign };
        })
      ).subscribe(({ countsByDate, campaignName }) => {
        this.populateDataSource(startDate, endDate, countsByDate, campaignName);
      });
    });
  }

  fetchAndProcessEntries() {
    const startDate = new Date('2024-05-01');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const campaigns = ['entries', 'lylregistration'];

    campaigns.forEach(campaign => {
      const dateField = campaign === 'entries' ? 'createddate' : 'entrydata';
      this.firestore.collection<any>(campaign, ref =>
        ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
           .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
      ).valueChanges().pipe(
        takeUntil(this.unsubscribe$),
        map(entries => {
          const countsByDate: { [key: string]: number } = {};
          entries.forEach(entry => {
            const date = entry[dateField].toDate();
            const dateString = this.formatDate(date);
            countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
          });
          return { countsByDate, campaignName: campaign };
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
      const liquidity = await this.getamountreturn(date, campaignName);
      const spendmm = await this.getamountspend(date, campaignName);
      const lylentry = await this.getlylentry(date, campaignName);
      const lylentryhp = await this.getlylentryforhp(date, campaignName, 'fromhp');
      const lylentrynothp = await this.getlylentryforhp(date, campaignName, 'notfromhp');
      const lylentryfromhp = await this.getlylentryfromhpornot(date, campaignName, 'fromhp');
      const lylentrynotfromhp = await this.getlylentryfromhpornot(date, campaignName, 'notfromhp');
      const lylentryfromhpsale = await this.getlylentryforsales(date, campaignName, 'fromhp','count');
      const lylentrynotfromhpsale = await this.getlylentryforsales(date, campaignName, 'notfromhp','count');
      const lylentryfromhpsaleamt = await this.getlylentryforsales(date, campaignName, 'fromhp','saleamt');
      const lylentrynotfromhpsaleamt = await this.getlylentryforsales(date, campaignName, 'notfromhp','saleamt');
      const lylentryfromhpsaleamtret = await this.getlylentryforsales(date, campaignName, 'fromhp','return');
      const lylentrynotfromhpsaleamtret = await this.getlylentryforsales(date, campaignName, 'notfromhp','return');


      const existingDataIndex = this.dataSource.data.findIndex(d => d.date === date);
      if (existingDataIndex !== -1) {
        const existingData = this.dataSource.data[existingDataIndex];
        if (campaignName === 'entries') {
          existingData.homepage = count;
        } else if (campaignName === 'adsinsight') {
          existingData.spend_MM = spendmm;
        } else if (campaignName === 'lylregistration') {
          existingData.lylreg = lylentry;
          existingData.lylregfromhp = lylentryhp;
          existingData.lylregnotfromhp = lylentrynothp;
        } else if (campaignName === 'lylwebinarattended') {
          existingData.lylattended = count;
          existingData.lylattendedfromhp = lylentryfromhp;
          existingData.lylattendednotfromhp = lylentrynotfromhp;
        } else if (campaignName === 'lylwebcompletewatch') {
          existingData.lylcomwatch = count;
          existingData.lylcomwatchfromhp = lylentryfromhp;
          existingData.lylcomwatchnotfromhp = lylentrynotfromhp;
        } else if (campaignName === 'lylapplied') {
          existingData.lylapplied = count;
          existingData.lylappliedfromhp = lylentryfromhp;
          existingData.lylappliednotfromhp = lylentrynotfromhp;
        } else if (campaignName === 'loghot') {
          existingData.loghot = count;
        } else if (campaignName === 'superhotopportunities') {
          existingData.superopportunity = count;
        } else if (campaignName === 'leads') {
          existingData.sales = count;
          existingData.salesfromhp = lylentryfromhpsale;
          existingData.salesnotfromhp = lylentrynotfromhpsale;
          existingData.sales_total = totalPurchaseValue;
          existingData.sales_totalfromhp = lylentryfromhpsaleamt;
          existingData.sales_totalnotfromhp = lylentrynotfromhpsaleamt;
          existingData.amountreturn = liquidity;
          existingData.amountreturnfromhp = lylentryfromhpsaleamtret;
          existingData.amountreturnnotfromhp = lylentrynotfromhpsaleamtret;
        }
      } else {
        const newData: MyData = {
          date,
          homepage: campaignName === 'entries' ? count : 0,
          lylreg: campaignName === 'lylregistration' ? count : 0,
          lylregfromhp: campaignName === 'lylregistration' ? lylentryhp : 0,
          lylregnotfromhp: campaignName === 'lylregistration' ? lylentrynothp : 0,
          lylattended: campaignName === 'lylwebinarattended' ? count : 0,
          lylcomwatch: campaignName === 'lylwebcompletewatch' ? count : 0,
          lylcomwatchfromhp: campaignName === 'lylwebcompletewatch' ? lylentryfromhp : 0,
          lylcomwatchnotfromhp: campaignName === 'lylwebcompletewatch' ? lylentrynotfromhp : 0,
          lylapplied: campaignName === 'lylapplied' ? count : 0,
          lylappliedfromhp: campaignName === 'lylapplied' ? lylentryfromhp : 0,
          lylappliednotfromhp: campaignName === 'lylapplied' ? lylentrynotfromhp : 0,
          lylattendedfromhp: campaignName === 'lylwebinarattended' ? lylentryfromhp : 0,
          lylattendednotfromhp: campaignName === 'lylwebinarattended' ? lylentrynotfromhp : 0,
          loghot: campaignName === 'loghot' ? count : 0,
          superopportunity: campaignName === 'superhotopportunities' ? count : 0,
          sales: campaignName === 'leads' ? count : 0,
          salesfromhp: campaignName === 'leads' ? lylentryfromhpsale : 0,
          salesnotfromhp: campaignName === 'leads' ? lylentrynotfromhpsale : 0,
          sales_total: campaignName === 'leads' ? totalPurchaseValue : 0,
          sales_totalfromhp: campaignName === 'leads' ? lylentryfromhpsaleamt : 0,
          sales_totalnotfromhp: campaignName === 'leads' ? lylentrynotfromhpsaleamt : 0,
          amountreturn: campaignName === 'leads' ? liquidity : 0,
          amountreturnfromhp: campaignName === 'leads' ? lylentryfromhpsaleamtret : 0,
          amountreturnnotfromhp: campaignName === 'leads' ? lylentrynotfromhpsaleamtret : 0,
          spend_MM: campaignName === 'adsinsight' ? spendmm : 0,
        };

        this.dataSource.data = [...this.dataSource.data, newData];
        console.log('data',this.dataSource.data)
      }
    }
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
totallylregnhp(){
  return this.dataSource.data.map(t => t.lylregnotfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylreghp(){
  return this.dataSource.data.map(t => t.lylregfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylattend(){
  return this.dataSource.data.map(t => t.lylattended).reduce((acc, curr) => acc + curr,0);
}
totallylattendnhp(){
  return this.dataSource.data.map(t => t.lylattendednotfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylattendhp(){
  return this.dataSource.data.map(t => t.lylattendedfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylcomwatch(){
  return this.dataSource.data.map(t => t.lylcomwatch).reduce((acc, curr) => acc + curr,0);
}
totallylcomwatchnhp(){
  return this.dataSource.data.map(t => t.lylcomwatchnotfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylcomwatchhp(){
  return this.dataSource.data.map(t => t.lylcomwatchfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylapplied(){
  return this.dataSource.data.map(t => t.lylapplied).reduce((acc, curr) => acc + curr,0);
}
totallylappliednhp(){
  return this.dataSource.data.map(t => t.lylappliednotfromhp).reduce((acc, curr) => acc + curr,0);
}
totallylappliedhp(){
  return this.dataSource.data.map(t => t.lylappliedfromhp).reduce((acc, curr) => acc + curr,0);
}
totalsales(){
  return this.dataSource.data.map(t => t.sales).reduce((acc, curr) => acc + curr,0);
}
totalsalesnhp(){
  return this.dataSource.data.map(t => t.salesnotfromhp).reduce((acc, curr) => acc + curr,0);
}
totalsaleshp(){
  return this.dataSource.data.map(t => t.salesfromhp).reduce((acc, curr) => acc + curr,0);
}
totalsale(){
  return this.dataSource.data.map(t => t.sales_total).reduce((acc, curr) => acc + curr,0);
}
totalsalenhp(){
  return this.dataSource.data.map(t => t.sales_totalnotfromhp).reduce((acc, curr) => acc + curr,0);
}
totalsalehp(){
  return this.dataSource.data.map(t => t.sales_totalfromhp).reduce((acc, curr) => acc + curr,0);
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
totalspendnhp(){
  return this.dataSource.data.map(t => t.amountreturnnotfromhp).reduce((acc, curr) => acc + curr,0);
}
totalspendhp(){
  return this.dataSource.data.map(t => t.amountreturnfromhp).reduce((acc, curr) => acc + curr,0);
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
            liquidity = liquidity + (entry.initialpayment) ;
          });
          resolve(liquidity);
      }, error => {
          reject(error);
      });
  });
}

async getlylentry(date: string, campaignName: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(0, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(23, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  return new Promise<number>((resolve, reject) => {
      let count = 0;
      this.firestore.collection<any>(campaignName, ref => ref.where('entrydata', '>=', startTimestamp)
          .where('entrydata', '<=', endTimestamp)
      ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
          entries.forEach(entry => {
            if (entry.event == 'lylregistration'){
            count +=1  ;
            }
          });
          resolve(count);
      }, error => {
          reject(error);
      });
  });
}

async getlylentryforhp(date: string, campaignName: string, label: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(0, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(23, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);

  const attendedEmails: string[] = [];
  await this.firestore.collection<any>(campaignName, ref => ref.where('entrydate', '>=', startTimestamp))
    .get().toPromise().then(snapshot => {
      snapshot.docs.forEach(doc => {
        const email = doc.data().email.trim();
        attendedEmails.push(email);
      });
    });

  return new Promise<number>((resolve, reject) => {
    this.firestore.collection<any>('lylregistration', ref => ref.where('entrydata', '>=', startTimestamp)
      .where('entrydata', '<=', endTimestamp)
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(async entries => {
      let lylattend = 0;
      let count = 0;

      const checks = entries.map(async entry => {
        const email = entry.email.trim();

        if (entry.event === 'lylregistration') {
          if (label === 'fromhp' && (entry.qa1 === 'nil' || entry.qa2 === 'nil' || entry.url.includes('www.antanoharini.com') || entry.url === 'lyl ewebinar')) {
            count++;
            if (attendedEmails.includes(email)) {
              lylattend++;
              //console.log(`Counted fromhp for email: ${email}`);
            }
          } else if (label === 'notfromhp' && ( entry.url.includes('global.antanoharini.com') )) {
            count++;
            if (attendedEmails.includes(email)) {
              lylattend++;
              //console.log(`Counted notfromhp for email: ${email}`);
            }
          }
        }
      });

      await Promise.all(checks);
      //console.log(`Final count: ${count}`);
      //console.log(`Final lylattend count: ${lylattend}`);
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}

async getlylentryforsales(date: string, campaignName: string, label: string, field: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(0, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(23, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);

  const attendedEmails: { [email: string]: { totalpurchasevalue: number; initialpayment: number } } = {};
  await this.firestore.collection<any>(campaignName, ref => ref.where('converteddate', '>=', startTimestamp))
    .get().toPromise().then(snapshot => {
      snapshot.docs.forEach(doc => {
        const email = doc.data().email.trim();
        attendedEmails[email] = {
          totalpurchasevalue: doc.data().totalpurchasevalue || 0,
          initialpayment: doc.data().initialpayment || 0
        };
      });
    });

  const lylattendLylReg = await this.processLylRegistrationEntries(startTimestamp, endTimestamp, label, field, attendedEmails);
  const lylattendEntries = await this.processEntries(startTimestamp, endTimestamp, label, field, attendedEmails);

  return lylattendLylReg + lylattendEntries;
}

async processLylRegistrationEntries(startTimestamp: firebase.firestore.Timestamp, endTimestamp: firebase.firestore.Timestamp, label: string, field: string, attendedEmails: { [email: string]: { totalpurchasevalue: number; initialpayment: number } }): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    this.firestore.collection<any>('lylregistration', ref => ref.where('entrydata', '>=', startTimestamp)
      .where('entrydata', '<=', endTimestamp)
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(async entries => {
      let lylattend = 0;

      const checks = entries.map(async entry => {
        const email = entry.email.trim();

        if (label === 'fromhp' && (entry.qa1 === 'nil' || entry.qa2 === 'nil' || entry.url.includes('www.antanoharini.com') || entry.url === 'lyl ewebinar')) {
          if (attendedEmails[email]) {
            if (field === 'count') {
              lylattend++;
            } else if (field === 'saleamt') {
              lylattend += attendedEmails[email].totalpurchasevalue;
            } else {
              lylattend += attendedEmails[email].initialpayment;
            }
          }
        } else if (label === 'notfromhp' && entry.url.includes('global.antanoharini.com')) {
          if (attendedEmails[email]) {
            if (field === 'count') {
              lylattend++;
            } else if (field === 'saleamt') {
              lylattend += attendedEmails[email].totalpurchasevalue;
            } else {
              lylattend += attendedEmails[email].initialpayment;
            }
          }
        }
      });

      await Promise.all(checks);
      resolve(lylattend);
    }, error => {
      reject(error);
    });
  });
}

async processEntries(startTimestamp: firebase.firestore.Timestamp, endTimestamp: firebase.firestore.Timestamp, label: string, field: string, attendedEmails: { [email: string]: { totalpurchasevalue: number; initialpayment: number } }): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    this.firestore.collection<any>('entries', ref => ref.where('createddate', '>=', startTimestamp)
      .where('createddate', '<=', endTimestamp)
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(async entries => {
      let lylattend = 0;

      const checks = entries.map(async entry => {
        const email = entry.email.trim();

        if (label === 'fromhp') {
          if (attendedEmails[email]) {
            if (field === 'count') {
              lylattend++;
            } else if (field === 'saleamt') {
              lylattend += attendedEmails[email].totalpurchasevalue;
            } else {
              lylattend += attendedEmails[email].initialpayment;
            }
          }
        }
      });

      await Promise.all(checks);
      resolve(lylattend);
    }, error => {
      reject(error);
    });
  });
}

// async getlylentryforsales(date: string, campaignName: string, label: string, field: string): Promise<number> {
//   const [day, month, year] = date.split("-").map(Number);
//   const dateObject = new Date(year, month - 1, day);
//   dateObject.setHours(0, 0, 0, 0);
//   const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
//   dateObject.setHours(23, 59, 59, 999);
//   const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);

//   const attendedEmails: { [email: string]: { totalpurchasevalue: number; initialpayment: number } } = {};
//   await this.firestore.collection<any>(campaignName, ref => ref.where('converteddate', '>=', startTimestamp))
//     .get().toPromise().then(snapshot => {
//       snapshot.docs.forEach(doc => {
//         const email = doc.data().email.trim();
//         attendedEmails[email] = {
//           totalpurchasevalue: doc.data().totalpurchasevalue || 0,
//           initialpayment: doc.data().initialpayment || 0
//         };
//       });
//     });

//   return new Promise<number>((resolve, reject) => {
//     this.firestore.collection<any>('lylregistration', ref => ref.where('entrydata', '>=', startTimestamp)
//       .where('entrydata', '<=', endTimestamp)
//     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(async entries => {
//       let lylattend = 0;
//       let count = 0;

//       const checks = entries.map(async entry => {
//         const email = entry.email.trim();

//         if (entry.event === 'lylregistration') {
//           if (label === 'fromhp' && (entry.qa1 === 'nil' || entry.qa2 === 'nil' || entry.url.includes('www.antanoharini.com') || entry.url === 'lyl ewebinar')) {
//             count++;
//             if (attendedEmails[email]) {
//               if (field === 'count') {
//                 lylattend++;
//                 //console.log(`Counted fromhp for email: ${email}`);
//               } else if (field === 'saleamt') {
//                 lylattend += attendedEmails[email].totalpurchasevalue;
//                 //console.log(`Added sale amount fromhp for email: ${email}`);
//               } else {
//                 lylattend += attendedEmails[email].initialpayment;
//               }
//             }
//           } else if (label === 'notfromhp' && entry.url.includes('global.antanoharini.com')) {
//             count++;
//             if (attendedEmails[email]) {
//               if (field === 'count') {
//                 lylattend++;
//                 //console.log(`Counted notfromhp for email: ${email}`);
//               } else if (field === 'saleamt') {
//                 lylattend += attendedEmails[email].totalpurchasevalue;
//                 //console.log(`Added sale amount notfromhp for email: ${email}`);
//               }
//               else {
//                 lylattend += attendedEmails[email].initialpayment;
//               }
//             }
//           }
//         }
//       });

//       await Promise.all(checks);
//       //console.log(`Final count: ${count}`);
//       //console.log(`Final lylattend count: ${lylattend}`);
//       resolve(lylattend);
//     }, error => {
//       reject(error);
//     });
//   });
// }


async getlylentryfromhpornot(date: string, campaignName: string, label: string): Promise<number> {
  const [day, month, year] = date.split("-").map(Number);
  const dateObject = new Date(year, month - 1, day);
  dateObject.setHours(0, 0, 0, 0);
  const startTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);
  dateObject.setHours(23, 59, 59, 999);
  const endTimestamp = firebase.firestore.Timestamp.fromDate(dateObject);

  const attendedEmails: string[] = [];
  await this.firestore.collection<any>(campaignName, ref => ref.where('entrydate', '>=', startTimestamp))
    .get().toPromise().then(snapshot => {
      snapshot.docs.forEach(doc => {
        const email = doc.data().email.trim();
        attendedEmails.push(email);
      });
    });

  return new Promise<number>((resolve, reject) => {
    this.firestore.collection<any>('lylregistration', ref => ref.where('entrydata', '>=', startTimestamp)
      .where('entrydata', '<=', endTimestamp)
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(async entries => {
      let lylattend = 0;
      let count = 0;

      const checks = entries.map(async entry => {
        const email = entry.email.trim();

        if (entry.event === 'lylregistration') {
          if (label === 'fromhp' && (entry.qa1 === 'nil' || entry.qa2 === 'nil' || entry.url.includes('www.antanoharini.com') || entry.url === 'lyl ewebinar')) {
            count++;
            if (attendedEmails.includes(email)) {
              lylattend++;
              //console.log(`Counted fromhp for email: ${email}`);
            }
          } else if (label === 'notfromhp' && ( entry.url.includes('global.antanoharini.com') )) {
            count++;
            if (attendedEmails.includes(email)) {
              lylattend++;
              //console.log(`Counted notfromhp for email: ${email}`);
            }
          }
        }
      });

      await Promise.all(checks);
      //console.log(`Final count: ${count}`);
      //console.log(`Final lylattend count: ${lylattend}`);
      resolve(lylattend);
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
      } else {
      this.firestore.collection<any>(campaignName, ref => ref.where('docdate', '>=', startTimestamp)
          .where('docdate', '<=', endTimestamp)
      ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
          entries.forEach(entry => {
            spendmm = spendmm + (entry.amountSpend || 0) ;
          });
          resolve(spendmm);
      }
    , error => {
          reject(error);
      });
    }
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