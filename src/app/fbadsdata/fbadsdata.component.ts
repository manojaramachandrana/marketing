import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fbadsdata',
  templateUrl: './fbadsdata.component.html',
  styleUrls: ['./fbadsdata.component.css']
})

export class FbadsdataComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['month', 'leads', 'sales','conversion_ratio', 'conversion_30', 'conversion_60', 'conversion_90', 'conversion_120', 'conversion_240', 'conversion_360'];
  dataSource = new MatTableDataSource<{ month: string, leads: number, sales: number, conversion_30: number, conversion_60: number, conversion_90: number, conversion_120: number, conversion_240: number, conversion_360: number }>();
  private unsubscribe$ = new Subject<void>();
  searchMonth: string = '';
  selectedRow: any | null = null;
  showDetails: boolean = false;
  matchingLeads: any[] = [];
  entries: any[] = [];
  lylregistration: any[] = [];
  selectedMonth: string = '';
  months: string[] = []; 

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.fetchAndProcessEntries();
    this.fetchEntries();
    this.fetchLylRegistration();
    if (this.months.length > 0) {
      this.selectedMonth = this.months[this.months.length - 1];
    }
  }

  conversionRatio(element: any): string {
    if (element && element.leads !== 0) {
      return (element.sales / element.leads).toFixed(2); 
    } else {
      return '0';
    }
  }
  
  getLastMonth(): string {
    if (this.dataSource.data.length > 0) {
      return this.dataSource.data[this.dataSource.data.length - 1].month;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleAdDetails(row: any): void {
    if (this.selectedRow === row) {
      this.showDetails = !this.showDetails;
      if (this.showDetails) {
        this.selectedRow = row;
      } else {
        this.selectedRow = null;
      }
    } else {
      this.showDetails = true;
      this.selectedRow = row;
      this.fetchLeadData(row);
    }
  }

  fetchLeadData(row: any): void {
    const month = row.month;
    if (!month) {
      console.error('Month is undefined or null in the selected row:', row);
      return;
    }

    this.firestore.collection<any>('leads').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(leads => {
      this.matchingLeads = [];
      leads.forEach(lead => {
        const date = lead.converteddate.toDate();
        const selectedMonth = date.toLocaleString('en-us', { month: 'long' });
        const selectedYear = date.getFullYear();
        const monthYear = `${selectedMonth} ${selectedYear}`;

        if (monthYear === month) {
          this.matchingLeads.push(lead);
        }
      });
    });
  }

  getDayDifference(start: Date, end: Date): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const startTime = start.getTime();
    const endTime = end.getTime();
    const difference = Math.abs(endTime - startTime);
    return Math.round(difference / millisecondsPerDay);
  }

  fetchEntries(): void {
    this.firestore.collection<any>('entries').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(entries => {
      this.entries = entries;
    });
  }

  fetchLylRegistration(): void {
    this.firestore.collection<any>('lylregistration').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(registrations => {
      this.lylregistration = registrations;
    });
  }

  getEmailDetails(email: string): any {
    const entry = this.entries.find((entry: { email: string; }) => entry.email === email);
    if (entry) {
      return { type: 'entry', data: entry.createddate };
    }

    const registration = this.lylregistration.find((reg: { email: string; }) => reg.email === email);
    if (registration) {
      return { type: 'registration', data: registration.entrydata };
    }

    return null;
  }

  async fetchAndProcessEntries() {
    const countsByMonth: { [key: string]: { leads: number, sales: number, conversion_30: number, conversion_60: number, conversion_90: number, conversion_120: number, conversion_240: number, conversion_360: number, processedLeads: Set<string> } } = {};

    await this.firestore.collection<any>('entries').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(entries => {
      entries.forEach(entry => {
        const date = entry.createddate.toDate();
        const month = date.toLocaleString('en-us', { month: 'long' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;
        if (!countsByMonth[monthYear]) {
          countsByMonth[monthYear] = { leads: 0, sales: 0, conversion_30: 0, conversion_60: 0, conversion_90: 0, conversion_120: 0, conversion_240: 0, conversion_360: 0, processedLeads: new Set<string>() };
          this.months.push(monthYear); 
        }
        countsByMonth[monthYear].leads++;
        if (!countsByMonth[monthYear].processedLeads.has(entry.email)) {
          countsByMonth[monthYear].processedLeads.add(entry.email);
          this.checkConversion(entry.email, date, countsByMonth[monthYear]);
        }
      });
    });

    await this.firestore.collection<any>('lylregistration').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(entries => {
      entries.forEach(entry => {
        const date = entry.entrydata.toDate();
        const month = date.toLocaleString('en-us', { month: 'long' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;
        if (!countsByMonth[monthYear]) {
          countsByMonth[monthYear] = { leads: 0, sales: 0, conversion_30: 0, conversion_60: 0, conversion_90: 0, conversion_120: 0, conversion_240: 0, conversion_360: 0, processedLeads: new Set() };
          this.months.push(monthYear); 
        }
        countsByMonth[monthYear].leads++;
        if (!countsByMonth[monthYear].processedLeads.has(entry.email)) {
          countsByMonth[monthYear].processedLeads.add(entry.email);
          this.checkConversion(entry.email, date, countsByMonth[monthYear]);
        }
      });
    });

    await this.firestore.collection<any>('leads').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(leads => {
      leads.forEach(lead => {
        const date = lead.converteddate.toDate();
        const month = date.toLocaleString('en-us', { month: 'long' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;
        if (!countsByMonth[monthYear]) {
          countsByMonth[monthYear] = { leads: 0, sales: 0, conversion_30: 0, conversion_60: 0, conversion_90: 0, conversion_120: 0, conversion_240: 0, conversion_360: 0, processedLeads: new Set() };
          this.months.push(monthYear);
        }
        countsByMonth[monthYear].sales++;
        if (!countsByMonth[monthYear].processedLeads.has(lead.email)) {
          countsByMonth[monthYear].processedLeads.add(lead.email);
        }
      });
    });

    setTimeout(() => {
      this.populateDataSource(countsByMonth);
    }, 5000);
  }

async  checkConversion(email: string, entryDate: Date, monthData: any) {
   await this.firestore.collection<any>('leads', ref => ref.where('email', '==', email)).valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(leads => {
      leads.forEach(lead => {
        const leadDate = lead.converteddate.toDate();
        const dateDifference = Math.abs(entryDate.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dateDifference <= 30) {
          monthData.conversion_30++;
          console.log('Conversion 30:', email);
        } else if (dateDifference <= 60) {
          monthData.conversion_60++;
        } else if (dateDifference <= 90) {
          monthData.conversion_90++;
        } else if (dateDifference <= 120) {
          monthData.conversion_120++;
        } else if (dateDifference <= 240) {
          monthData.conversion_240++;
        } else if (dateDifference <= 360) {
          monthData.conversion_360++;
        }
      });
    });
  }

  populateDataSource(countsByMonth: { [key: string]: { leads: number, sales: number, conversion_30: number, conversion_60: number, conversion_90: number, conversion_120: number, conversion_240: number, conversion_360: number } }) {
    this.dataSource.data = [];

    Object.keys(countsByMonth).forEach(month => {
      const newDataItem = { month, leads: countsByMonth[month].leads, sales: countsByMonth[month].sales, conversion_30: countsByMonth[month].conversion_30, conversion_60: countsByMonth[month].conversion_60, conversion_90: countsByMonth[month].conversion_90, conversion_120: countsByMonth[month].conversion_120, conversion_240: countsByMonth[month].conversion_240, conversion_360: countsByMonth[month].conversion_360 };
      const existingMonthIndex = this.dataSource.data.findIndex(item => item.month === month);
      if (existingMonthIndex !== -1) {
        this.dataSource.data[existingMonthIndex].leads += newDataItem.leads;
        this.dataSource.data[existingMonthIndex].sales += newDataItem.sales;
        this.dataSource.data[existingMonthIndex].conversion_30 += newDataItem.conversion_30;
        this.dataSource.data[existingMonthIndex].conversion_60 += newDataItem.conversion_60;
        this.dataSource.data[existingMonthIndex].conversion_90 += newDataItem.conversion_90;
        this.dataSource.data[existingMonthIndex].conversion_120 += newDataItem.conversion_120;
        this.dataSource.data[existingMonthIndex].conversion_240 += newDataItem.conversion_240;
        this.dataSource.data[existingMonthIndex].conversion_360 += newDataItem.conversion_360;
      } else {
        this.dataSource.data.push(newDataItem);
      }
    });

    this.dataSource.data = [...this.dataSource.data];
  }

  applyFilter() {
  
    if (this.selectedMonth.trim().toLowerCase() === 'all') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = this.selectedMonth.trim().toLowerCase();
    }
  }
}
