import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  loading: boolean = true;
  private unsubscribe$ = new Subject<void>();
  private currrentweeklylRegOrEntriesEmails = new Set<string>(); 
  private lastweeklylRegOrEntriesEmails = new Set<string>(); 
  private currentmonthlylRegOrEntriesEmails = new Set<string>(); 
  private lastmonthlylRegOrEntriesEmails = new Set<string>(); 
  private currentweekleadsEmails = new Set<string>(); 
  private lastweekleadsEmails = new Set<string>();
  private currentmonthleadsEmails = new Set<string>();
  private lastmonthleadsEmails = new Set<string>();
  private currentweekFunnelMCEmails = new Set<string>();
  private lastweekFunnelMCEmails = new Set<string>();
  private currentmonthFunnelMCEmails = new Set<string>();
  private lastmonthFunnelMCEmails = new Set<string>();

  constructor( private firestore: AngularFirestore) {}
  dataSource = new MatTableDataSource< { date: string,currentweek: number,lastweek: number,currentmonth: number,lastmonth: number,currentweeklead: number, currentmonthlead: number, lastweeklead: number, lastmonthlead: number, currentweektpv: number, lastweektpv: number, currentmonthtpv: number, lastmonthtpv: number, currentweekecosystem:number, lastweekecosystem: number, currentmonthecosystem: number, lastmonthecosystem: number, currentweekemiecosystem: number, lastweekemiecosystem: number, currentmonthemiecosystem: number, lastmonthemiecosystem: number, currentweekparticipant: number, lastweekparticipant: number, currentmonthparticipant:number, lastmonthparticipant: number, currentweekfreetopaid: number, lastweekfreetopaid: number, currentmonthfreetopaid: number, lastmonthfreetopaid: number }>(); 
  displayedColumns: string[] = ['no', 'currentweek', 'lastweek','metrics'];
  //displayedColumns: string[] = [ 'date', 'currentweek', 'lastweek', 'currentmonth', 'lastmonth', 'currentweeklead', 'lastweeklead', 'currentmonthlead', 'lastmonthlead', 'currentweektpv', 'lastweektpv', 'currentmonthtpv', 'lastmonthtpv', 'currentweekecosystem', 'lastweekecosystem', 'currentmonthecosystem', 'lastmonthecosystem', 'currentweekemiecosystem', 'lastweekemiecosystem', 'currentmonthemiecosystem', 'lastmonthemiecosystem', 'currentweekparticipant', 'lastweekparticipant', 'currentmonthparticipant', 'lastmonthparticipant', 'currentweekfreetopaid', 'lastweekfreetopaid', 'currentmonthfreetopaid', 'lastmonthfreetopaid'];

  ngOnInit(): void {
    this.fetchdata();
    this.loadData().then(() => {
      this.loading = false;
    });
  }

  isLessThanOrEqual(value: number, threshold: number): boolean {
   return value < threshold;
  }

  isGreaterThanOrEqual(value: number, threshold: number): boolean {
    return value >= threshold;
  }

  loadData(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.dataSource ;
        resolve();
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  weekpaiduser() {
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweek, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.currentweek, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthpaiduser() {
    let currentMonthTotal: any = this.currentmonth();
    let lastMonthTotal: any = this.lastmonth();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekecosystem() {
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweekecosystem, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.currentweekecosystem, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthecosystem() {
    let currentMonthTotal: any = this.currentmonthecosystem();
    let lastMonthTotal: any = this.lastmonthecosystem();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekemiecosystem() {
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweekemiecosystem, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.currentweekemiecosystem, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthemiecosystem() {
    let currentMonthTotal: any = this.currentmonthemiecosystem();
    let lastMonthTotal: any = this.lastmonthemiecosystem();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekorder() {
    let currentMonthTotal: any = this.currentweektpv();
    let lastMonthTotal: any = this.lastweektpv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthorder() {
    let currentMonthTotal: any = this.currentmonthtpv();
    let lastMonthTotal: any = this.lastmonthtpv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weeklifetime() {
    let currentMonthTotal: any = this.currentweekltv();
    let lastMonthTotal: any = this.lastweekltv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthlifetime() {
    let currentMonthTotal: any = this.currentmonthltv();
    let lastMonthTotal: any = this.lastmonthltv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }

  // currentmonthfreetopaid(){
  //   return this.dataSource.data.map(t => t.currentmonthfreetopaid);
  // }
  // lastmonthfreetopaid(){
  //   return this.dataSource.data.map(t => t.lastmonthfreetopaid);
  // }

  lastweekfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweekfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweeklead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(3);
  }
  lastmonthfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthlead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(3);
  }
  currentmonthfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthlead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(3);
  }
  currentweekfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweekfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweeklead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(3);
  }
  monthfreetopaid() {
    let currentMonthTotal: any = this.currentmonthfreetopaid();
    let lastMonthTotal: any = this.lastmonthfreetopaid();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(3);
  }
  weekfreetopaid() {
    let currentMonthTotal: any = this.currentweekfreetopaid();
    let lastMonthTotal: any = this.lastweekfreetopaid();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(3);
  }

  currentmonth() {
    return this.dataSource.data.map(t => t.currentmonth);
  }
  lastmonth() {
    return this.dataSource.data.map(t => t.lastmonth);
  }
  currentmonthecosystem() {
    return this.dataSource.data.map(t => t.currentmonthecosystem);
  }
  lastmonthecosystem() {
    return this.dataSource.data.map(t => t.lastmonthecosystem);
  }
  currentmonthemiecosystem() {
    return this.dataSource.data.map(t => t.currentmonthemiecosystem);
  }
  lastmonthemiecosystem() {
    return this.dataSource.data.map(t => t.lastmonthemiecosystem);
  }
  currentweektpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweektpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweek, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastweektpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweektpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweek, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  currentmonthtpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthtpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonth, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastmonthtpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthtpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonth, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }

  currentweekltv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweektpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweekparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastweekltv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweektpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweekparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  currentmonthltv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthtpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastmonthltv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthtpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  
  fetchdata(){
    var currentDate = new Date();
    var dayOfWeek = currentDate.getDay();
    var sundayDiff = dayOfWeek;
    var saturdayDiff = 6 - dayOfWeek;
    var sundayDate = new Date(currentDate);
    sundayDate.setDate(currentDate.getDate() - sundayDiff);
    var saturdayDate = new Date(currentDate);
    saturdayDate.setDate(currentDate.getDate() + saturdayDiff);
    var lastSaturdayDate = new Date(currentDate);
    lastSaturdayDate.setDate(currentDate.getDate() - (dayOfWeek + 1)); 
    var lastSundayDate = new Date(lastSaturdayDate);
    lastSundayDate.setDate(lastSaturdayDate.getDate() - 6); 
    
    console.log("Sunday " , sundayDate);
    console.log("Saturday " , saturdayDate);
    console.log("Sunday", lastSundayDate);
    console.log("Saturday ", lastSaturdayDate);
  
    var startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    var startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    var endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  
    console.log("Start of current month:", startOfCurrentMonth);
    console.log("End of current month:", endOfCurrentMonth);
    console.log("Start of last month:", startOfLastMonth);
    console.log("End of last month:", endOfLastMonth);
    const campaigns = [
      { campaignname: 'entries', startdate: sundayDate, enddate: saturdayDate, label: 'currentweeklead' ,tag: 'week'},
      { campaignname: 'lylregistration', startdate: sundayDate, enddate: saturdayDate, label: 'currentweeklead',tag: 'week' },
      { campaignname: 'leads', startdate: sundayDate, enddate: saturdayDate, label: 'currentweek',tag: 'week' },
      { campaignname: 'funnelmc', startdate: sundayDate, enddate: saturdayDate, label: 'currentweek',tag: 'week' },

      { campaignname: 'entries', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweeklead',tag: 'week' },
      { campaignname: 'lylregistration', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweeklead',tag: 'week' },
      { campaignname: 'leads', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweek',tag: 'week' },
      { campaignname: 'funnelmc', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweek',tag: 'week' },

      { campaignname: 'entries', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonthlead',tag: 'month' },
      { campaignname: 'lylregistration', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonthlead',tag: 'month' },
      { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonth',tag: 'month' },
      { campaignname: 'funnelmc', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonth',tag: 'month' },

      { campaignname: 'entries', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonthlead',tag: 'month' },
      { campaignname: 'lylregistration', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonthlead',tag: 'month' },
      { campaignname: 'leads', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonth',tag: 'month' },
      { campaignname: 'funnelmc', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonth',tag: 'month' },
    ];

    campaigns.forEach(campaign => {
      this.firestore.collection<any>(campaign.campaignname, ref =>
        ref.where((campaign.campaignname === 'leads' ? 'converteddate' : '') || (campaign.campaignname === 'lylregistration' ? 'entrydata' : 'createddate') , '>=',firebase.firestore.Timestamp.fromDate(campaign.startdate))
           .where((campaign.campaignname === 'leads' ? 'converteddate' : '') || (campaign.campaignname === 'lylregistration' ? 'entrydata' : 'createddate') , '<=',firebase.firestore.Timestamp.fromDate(campaign.enddate))
      ).valueChanges().pipe(takeUntil(this.unsubscribe$),
        map(entries => {
          const countsByDate: { [key: string]: number } = {};
          entries.forEach(entry => {
            const dateField = (campaign.campaignname === 'leads' ? 'converteddate' : '') || (campaign.campaignname === 'lylregistration' ? 'entrydata' : 'createddate') ;
            const date = entry[dateField].toDate();
            const dateString = this.formatDate(date);
            countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
          });
          return { countsByDate, campaignName: campaign.campaignname, label: campaign.label,tag: campaign.tag };
        })
      ).subscribe(({ countsByDate, campaignName, label,tag }) => {
        this.populateDataSource(campaign.startdate, campaign.enddate, countsByDate, campaignName, label,tag);
      });
    });
  }
 async populateDataSource(startDate: Date, endDate: Date, countsByDate: { [key: string]: number }, campaignName: string, label: string, tag:string) {
  const numberOfDays = this.getDifferenceInDays(startDate, endDate);
  let totalcount =0;
  let totalPurchaseValue =0;
  let totalemisubsale = 0;
  let tpv =0;
  let totalsubsale = 0;
  let totalparticipant =0;
  let totalfreetopaid = 0;
  for (let i = 0; i <= numberOfDays; i++) {
    const date = this.getDateFormatted(i, startDate);
    const count = countsByDate[date] || 0;
    totalcount +=count;
    totalPurchaseValue = await this.getTotalPurchaseValueForDate(startDate,endDate,label, campaignName);
    totalemisubsale = await this.getecosystem(startDate,endDate,label,campaignName);
    totalsubsale = await this.getemiecosystem(startDate,endDate,label,campaignName);
    totalparticipant = await this.getparticipant(startDate,endDate,label,campaignName);
    totalfreetopaid = await this.getfreetopaid(startDate,endDate,label,campaignName);
  }
  
  const existingDataIndex = this.dataSource.data.findIndex(d => d.date === 'data');
  if (existingDataIndex !== -1) {

    if (label === 'currentweeklead' && (campaignName === 'entries') )  {
      this.dataSource.data[existingDataIndex]['currentweeklead'] = totalcount ;
      this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = totalfreetopaid ;
     }
     if (label === 'currentweeklead' && (campaignName === 'lylregistration') )  {
       this.dataSource.data[existingDataIndex]['currentweeklead'] = this.dataSource.data[existingDataIndex]['currentweeklead']+ totalcount ;
       this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] + totalfreetopaid ;
      }
     if (campaignName === 'entries' && label === 'lastweeklead') {
     this.dataSource.data[existingDataIndex]['lastweeklead'] = totalcount ;
     this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = totalfreetopaid ;
     }
     if (label === 'lastweeklead' && (campaignName === 'lylregistration') )  {
       this.dataSource.data[existingDataIndex]['lastweeklead'] =this.dataSource.data[existingDataIndex]['lastweeklead']+ totalcount ;
       this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] + totalfreetopaid ;
      }
     if (campaignName === 'entries' && label === 'currentmonthlead') {
     this.dataSource.data[existingDataIndex]['currentmonthlead'] = totalcount;
     this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] = totalfreetopaid;
     }
     if (label === 'currentmonthlead' && (campaignName === 'lylregistration') )  {
       this.dataSource.data[existingDataIndex]['currentmonthlead'] =this.dataSource.data[existingDataIndex]['currentmonthlead']+ totalcount ;
       this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] =this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] + totalfreetopaid;
      }
     if (campaignName === 'entries' && label === 'lastmonthlead') {
     this.dataSource.data[existingDataIndex]['lastmonthlead'] = totalcount;
     this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = totalfreetopaid;
     }
     if (label === 'lastmonthlead' && (campaignName === 'lylregistration') )  {
       this.dataSource.data[existingDataIndex]['lastmonthlead'] =this.dataSource.data[existingDataIndex]['lastmonthlead']+ totalcount ;
       this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] + totalfreetopaid;
      }

    if (label === 'currentweek' && (campaignName === 'leads') )  {
     this.dataSource.data[existingDataIndex]['currentweek'] = totalcount ;
     this.dataSource.data[existingDataIndex]['currentweekecosystem'] = totalemisubsale;
     this.dataSource.data[existingDataIndex]['currentweekemiecosystem'] = totalsubsale;
     this.dataSource.data[existingDataIndex]['currentweekparticipant'] = totalparticipant;
     this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = totalfreetopaid ;
     this.dataSource.data[existingDataIndex]['currentweektpv'] = totalPurchaseValue;
    }
    if (label === 'currentweek' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['currentweek'] = this.dataSource.data[existingDataIndex]['currentweek']+ totalcount ;
      this.dataSource.data[existingDataIndex]['currentweekparticipant'] = this.dataSource.data[existingDataIndex]['currentweekparticipant'] +totalparticipant;
      this.dataSource.data[existingDataIndex]['currentweektpv'] = this.dataSource.data[existingDataIndex]['currentweektpv']  + totalPurchaseValue;
      this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] + totalfreetopaid ;
     }
    if (campaignName === 'leads' && label === 'lastweek') {
    this.dataSource.data[existingDataIndex]['lastweek'] = totalcount ;
    this.dataSource.data[existingDataIndex]['lastweektpv'] = totalPurchaseValue ;
    this.dataSource.data[existingDataIndex]['lastweekecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['lastweekemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['lastweekparticipant'] = totalparticipant;
    this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = totalfreetopaid ;
    }
    if (label === 'lastweek' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['lastweek'] =this.dataSource.data[existingDataIndex]['lastweek']+ totalcount ;
      this.dataSource.data[existingDataIndex]['lastweektpv'] =this.dataSource.data[existingDataIndex]['lastweektpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['lastweekparticipant'] =this.dataSource.data[existingDataIndex]['lastweekparticipant'] + totalparticipant;
      this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] + totalfreetopaid ;
     }
    if (campaignName === 'leads' && label === 'currentmonth') {
    this.dataSource.data[existingDataIndex]['currentmonth'] = totalcount;
    this.dataSource.data[existingDataIndex]['currentmonthtpv'] = totalPurchaseValue;
    this.dataSource.data[existingDataIndex]['currentmonthecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['currentmonthemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['currentmonthparticipant'] = totalparticipant;
    this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] = totalfreetopaid;
    }
    if (label === 'currentmonth' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['currentmonth'] =this.dataSource.data[existingDataIndex]['currentmonth']+ totalcount ;
      this.dataSource.data[existingDataIndex]['currentmonthtpv'] =this.dataSource.data[existingDataIndex]['currentmonthtpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['currentmonthparticipant'] =this.dataSource.data[existingDataIndex]['currentmonthparticipant'] + totalparticipant;
      this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] =this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] + totalfreetopaid;
     }
    if (campaignName === 'leads' && label === 'lastmonth') {
    this.dataSource.data[existingDataIndex]['lastmonth'] = totalcount;
    this.dataSource.data[existingDataIndex]['lastmonthtpv'] = totalPurchaseValue;
    this.dataSource.data[existingDataIndex]['lastmonthecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['lastmonthemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['lastmonthparticipant'] = totalparticipant;
    this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = totalfreetopaid;
    }
    if (label === 'lastmonth' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['lastmonth'] =this.dataSource.data[existingDataIndex]['lastmonth']+ totalcount ;
      this.dataSource.data[existingDataIndex]['lastmonthtpv'] =this.dataSource.data[existingDataIndex]['lastmonthtpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['lastmonthparticipant'] =this.dataSource.data[existingDataIndex]['lastmonthparticipant'] + totalparticipant;
      this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] + totalfreetopaid;
     }

  }
   else {
    const newDataItem = {
      date: 'data',currentweek: campaignName === 'leads' ? totalcount:0,lastweek: campaignName === 'leads' ? totalcount:0,currentmonth: campaignName === 'leads' ? totalcount:0,lastmonth: campaignName === 'leads' ? totalcount:0, currentweeklead : campaignName === 'entries' ? totalcount :0,currentmonthlead : campaignName === 'entries' ? totalcount:0,lastweeklead : campaignName === 'entries' ? totalcount:0, lastmonthlead : campaignName === 'entries' ? totalcount:0,currentweektpv : campaignName === 'leads' ? tpv:0, lastweektpv : campaignName === 'leads' ? tpv:0, currentmonthtpv : campaignName === 'leads' ? tpv:0, lastmonthtpv : campaignName === 'leads' ? tpv:0, currentweekecosystem : campaignName === 'leads' ? totalemisubsale:0,lastweekecosystem : campaignName === 'leads' ? totalemisubsale:0, currentmonthecosystem : campaignName === 'leads' ? totalemisubsale:0 ,lastmonthecosystem : campaignName === 'leads' ? totalemisubsale:0, currentweekemiecosystem : campaignName === 'leads' ? totalsubsale:0,lastweekemiecosystem : campaignName === 'leads' ? totalsubsale:0, currentmonthemiecosystem : campaignName === 'leads' ? totalsubsale:0, lastmonthemiecosystem : campaignName === 'leads' ? totalsubsale:0, currentweekparticipant: campaignName === 'leads' ? totalparticipant : 0,lastweekparticipant: campaignName === 'leads' ? totalparticipant : 0, currentmonthparticipant: campaignName === 'leads' ? totalparticipant : 0, lastmonthparticipant: campaignName === 'leads' ? totalparticipant : 0,
    currentweekfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,lastweekfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0, currentmonthfreetopaid: campaignName === 'leads' ? totalfreetopaid: 0, lastmonthfreetopaid: campaignName === 'leads' ? totalfreetopaid: 0};
    this.dataSource.data.push(newDataItem);
  }

  this.dataSource.data = [...this.dataSource.data];
  console.log(this.dataSource)
}

async getTotalPurchaseValueForDate(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let totalPurchaseValue = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if (campaignName === 'leads') {
          totalPurchaseValue += entry.totalpurchasevalue || 0;
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += entry.purchasevalue || 0;
        }
      });
      resolve(totalPurchaseValue);
    }, error => {
      reject(error);
    });
  });
}

async getecosystem(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let count = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if ( entry.journeyname === 'uP!' || entry.journeyname === 'BiG' || entry.journeyname === 'FTM' || entry.journeyname === 'CPM upgrade' || entry.journeyname === 'FastTrack Membership' || entry.journeyname === 'Launch Your Legacy L2') {
          count += 1;
        }
      });
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}

// async getpaiduser(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
//   return new Promise<number>((resolve, reject) => {

//     const dateField =  campaignName === 'lylregistration' ? 'entrydata' : 'createddate';
//     let count = 0;

//     this.firestore.collection<any>(campaignName, ref =>
//       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//       entries.forEach(entry => {
//         const email = entry.email;
//         if ( campaignName === 'lylregistration' && label === 'currentweek' ) {
//           this.currrentweeklylRegOrEntriesEmails.add(email);
//           console.log(this.currrentweeklylRegOrEntriesEmails)
//         } else if ( label === 'lastweek' && (campaignName === 'lylregistration' )) {
//           this.lastweeklylRegOrEntriesEmails.add(email);
//         } else if ( label === 'currentmonth' && (campaignName === 'lylregistration' )) {
//           this.currentmonthlylRegOrEntriesEmails.add(email);
//         } else if ( label === 'lastmonth' && (campaignName === 'lylregistration' )) {
//           this.lastmonthlylRegOrEntriesEmails.add(email);
//         } else if ( label === 'currentweek' && ( campaignName === 'entries')) {
//           this.currrentweeklylRegOrEntriesEmails.add(email);
//         } else if ( label === 'lastweek' && ( campaignName === 'entries')) {
//           this.lastweeklylRegOrEntriesEmails.add(email);
//         } else if ( label === 'currentmonth' && ( campaignName === 'entries')) {
//           this.currentmonthlylRegOrEntriesEmails.add(email);
//         } else if ( label === 'lastmonth' && ( campaignName === 'entries')) {
//           this.lastmonthlylRegOrEntriesEmails.add(email);
//         }
//       });
//         resolve(count);
//       }, (error: any) => {
//         reject(error);
//       });
//     });
//   }

async getfreetopaid(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {

    const dateField = (campaignName === 'leads' ? 'converteddate' : '') || (campaignName === 'lylregistration' ? 'entrydata' : 'createddate');
    let count = 0;

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        const email = entry.email;
        if ( campaignName === 'lylregistration' && label === 'currentweeklead' ) {
          this.currrentweeklylRegOrEntriesEmails.add(email);
        } else if ( label === 'lastweeklead' && (campaignName === 'lylregistration' )) {
          this.lastweeklylRegOrEntriesEmails.add(email);
        } else if ( label === 'currentmonthlead' && (campaignName === 'lylregistration' )) {
          this.currentmonthlylRegOrEntriesEmails.add(email);
        } else if ( label === 'lastmonthlead' && (campaignName === 'lylregistration' )) {
          this.lastmonthlylRegOrEntriesEmails.add(email);
        } else if ( label === 'currentweeklead' && ( campaignName === 'entries')) {
          this.currrentweeklylRegOrEntriesEmails.add(email);
        } else if ( label === 'lastweeklead' && ( campaignName === 'entries')) {
          this.lastweeklylRegOrEntriesEmails.add(email);
        } else if ( label === 'currentmonthlead' && ( campaignName === 'entries')) {
          this.currentmonthlylRegOrEntriesEmails.add(email);
        } else if ( label === 'lastmonthlead' && ( campaignName === 'entries')) {
          this.lastmonthlylRegOrEntriesEmails.add(email);
        } else if (campaignName === 'leads' && label === 'currentweek') {
          this.currentweekleadsEmails.add(email);
        } else if (campaignName === 'leads' && label === 'lastweek') {
          this.lastweekleadsEmails.add(email);
        } else if (campaignName === 'leads' && label === 'currentmonth') {
          this.currentmonthleadsEmails.add(email);
        } else if (campaignName === 'leads' && label === 'lastmonth') {
          this.lastmonthleadsEmails.add(email);
        } else if (campaignName === 'funnelmc' && label === 'currentweek'){
          this.currentweekFunnelMCEmails.add(email);
        } else if (campaignName === 'funnelmc' && label === 'lastweek'){
          this.lastweekFunnelMCEmails.add(email);
        } else if (campaignName === 'funnelmc' && label === 'currentmonth'){
          this.currentmonthFunnelMCEmails.add(email);
        } else if (campaignName === 'funnelmc' && label === 'lastmonth'){
          this.lastmonthFunnelMCEmails.add(email);
        } 
      });
     if(campaignName === 'leads' && label === 'currentweek'){
      this.currentweekleadsEmails.forEach(email => {
        if (this.currrentweeklylRegOrEntriesEmails.has(email)) {
          //console.log(email)
          count +=1;
        }
      });
    }else if ( campaignName === 'funnelmc' && label === 'currentweek'){
      this.currentweekFunnelMCEmails.forEach(email => {
        if (this.currrentweeklylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }
    else if(campaignName === 'leads' && label === 'lastweek'){
      this.lastweekleadsEmails.forEach(email => {
        if (this.lastweeklylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }else if ( campaignName === 'funnelmc' && label === 'lastweek'){
      this.lastweekFunnelMCEmails.forEach(email => {
        if (this.lastweeklylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }
    else if(campaignName === 'leads' && label === 'currentmonth'){
      this.currentmonthleadsEmails.forEach(email => {
        if (this.currentmonthlylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }else if ( campaignName === 'funnelmc' && label === 'currentmonth'){
      this.currentmonthFunnelMCEmails.forEach(email => {
        if (this.currentmonthlylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }
    else if(campaignName === 'leads' && label === 'lastmonth'){
      this.lastmonthleadsEmails.forEach(email => {
        if (this.lastmonthlylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }else if ( campaignName === 'funnelmc' && label === 'lastmonth'){
      this.lastmonthFunnelMCEmails.forEach(email => {
        if (this.lastmonthlylRegOrEntriesEmails.has(email)) {
          count +=1;
        }
      });
    }
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}


async getparticipant(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const uniqueEmails = new Set<string>(); 
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
    let count =0;

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        const email = entry.email; 
        if (!uniqueEmails.has(email)) { 
          uniqueEmails.add(email);
          if(campaignName === 'leads'){
          count +=1;
          }
          else if ( campaignName === 'funnelmc'){
            count += 1;
          }
        }
      });
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}

async getemiecosystem(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let count = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if ( (entry.totalpurchasevalue > entry.initialpayment) && ( entry.emiagreed !== ""  ) && ( entry.totalpurchasevalue !== entry.initialpayment) && ( entry.journeyname === 'uP!' || entry.journeyname === 'BiG' || entry.journeyname === 'FTM' || entry.journeyname === 'CPM upgrade' || entry.journeyname === 'FastTrack Membership' || entry.journeyname === 'Launch Your Legacy L2')) {
          count += 1;
        }
      });
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}

 formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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
}
