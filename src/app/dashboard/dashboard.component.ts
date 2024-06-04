import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboarddialogComponent } from '../dashboarddialog/dashboarddialog.component';
import { MatDialog } from '@angular/material/dialog';


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

  constructor( private firestore: AngularFirestore, private dialog: MatDialog) {}
  dataSource = new MatTableDataSource< { date: string,currentweek: number,lastweek: number,lastlastweek:number,currentmonth: number,lastmonth: number,lastlastmonth:number,currentweeklead: number,lastlastweeklead:number, currentmonthlead: number,lastlastmonthlead:number, lastweeklead: number, lastmonthlead: number, currentweektpv: number, lastweektpv: number,lastlastweektpv: number,lastlastmonthtpv:number, currentmonthtpv: number, lastmonthtpv: number, currentweekecosystem:number,lastlastweekecosystem:number,lastlastmonthecosystem:number, lastweekecosystem: number, currentmonthecosystem: number, lastmonthecosystem: number, currentweekemiecosystem: number,lastlastweekemiecosystem:number,lastlastmonthemiecosystem: number, lastweekemiecosystem: number, currentmonthemiecosystem: number, lastmonthemiecosystem: number, currentweekparticipant: number,lastlastweekparticipant: number,lastlastmonthparticipant:number, lastweekparticipant: number, currentmonthparticipant:number, lastmonthparticipant: number, currentweekfreetopaid: number,lastlastweekfreetopaid: number,lastlastmonthfreetopaid: number, lastweekfreetopaid: number, currentmonthfreetopaid: number, lastmonthfreetopaid: number, lastmonthltv: number,lastlastmonthltv: number,lastlastweekltv: number, currentmonthltv: number, lastweekltv:number,currentweekltv:number, currentweekwou:number,lastlastweekwou:number,currentmonthwou:number,lastlastmonthwou:number, lastweekwou:number,lastmonthwou:number }>(); 
  displayedColumns: string[] = ['no', 'currentweek', 'lastweek','metrics'];
  displayedColumn: string[] = ['no','lastlastweek', 'currentweek', 'lastweek','metrics'];
  displayColumn: string[] = ['check','no','lastlastweek', 'currentweek', 'lastweek','metrics'];
  //displayedColumns: string[] = [ 'date', 'currentweek', 'lastweek', 'currentmonth', 'lastmonth', 'currentweeklead', 'lastweeklead', 'currentmonthlead', 'lastmonthlead', 'currentweektpv', 'lastweektpv', 'currentmonthtpv', 'lastmonthtpv', 'currentweekecosystem', 'lastweekecosystem', 'currentmonthecosystem', 'lastmonthecosystem', 'currentweekemiecosystem', 'lastweekemiecosystem', 'currentmonthemiecosystem', 'lastmonthemiecosystem', 'currentweekparticipant', 'lastweekparticipant', 'currentmonthparticipant', 'lastmonthparticipant', 'currentweekfreetopaid', 'lastweekfreetopaid', 'currentmonthfreetopaid', 'lastmonthfreetopaid'];

  ngOnInit(): void {
    this.fetchdata();
    this.loadData().then(() => {
      this.loading = false;
    });
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(DashboarddialogComponent, {
      width: '400px', 
      data: { element } 
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
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
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastlastweek, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweek, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthpaiduser() {
    let currentMonthTotal: any = this.lastmonth();
    let lastMonthTotal: any = this.lastlastmonth();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekecosystem() {
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastlastweekecosystem, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweekecosystem, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthecosystem() {
    let currentMonthTotal: any = this.lastmonthecosystem();
    let lastMonthTotal: any = this.lastlastmonthecosystem();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekemiecosystem() {
    const lastWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastlastweekemiecosystem, 0);
    const currentWeekTotal = this.dataSource.data.reduce((total, item) => total + item.lastweekemiecosystem, 0);
    const percentageChange = ((currentWeekTotal - lastWeekTotal ) / lastWeekTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthemiecosystem() {
    let currentMonthTotal: any = this.lastmonthemiecosystem();
    let lastMonthTotal: any = this.lastlastmonthemiecosystem();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weekorder() {
    let currentMonthTotal: any = this.lastweektpv();
    let lastMonthTotal: any = this.lastlastweektpv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  monthorder() {
    let currentMonthTotal: any = this.lastmonthtpv();
    let lastMonthTotal: any = this.lastlastmonthtpv();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(0);
  }
  weeklifetime() {
    let currentMonthTotal: any = this.currentweeklt();
    let lastMonthTotal: any = this.lastweeklt();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(1);
  }
  monthlifetime() {
    let currentMonthTotal: any = this.currentmonthlt();
    let lastMonthTotal: any = this.lastmonthlt();
    if (lastMonthTotal === 0) {
        return 0;
    }
    const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    return percentageChange.toFixed(1);
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
    return averageTPV.toFixed(1);
  }
  lastmonthfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthlead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(1);
  }
  currentmonthfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthlead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(1);
  }
  currentweekfreetopaid() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweekfreetopaid, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweeklead, 0);
    const averageTPV = totalCount !== 0 ? (totalTPV / totalCount)*100 : 0;
    return averageTPV.toFixed(1);
  }
  monthfreetopaid() {
    let currentMonthTotal: any = this.currentmonthfreetopaid();
    let lastMonthTotal: any = this.lastmonthfreetopaid();
    
    if (lastMonthTotal === 0.0) {
        return 0;
    } else {
        const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        //console.log('per', percentageChange);
        
        if (!isNaN(percentageChange) && isFinite(percentageChange)) {
            return percentageChange.toFixed(3);
        } else {
            return 0;
        }
    }
}

weekfreetopaid() {
    let currentMonthTotal: any = this.currentweekfreetopaid();
    let lastMonthTotal: any = this.lastweekfreetopaid();
    
    if (lastMonthTotal === 0.0) {
        return 0;
    } else {
        const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        //console.log('pert', percentageChange);
        
        if (!isNaN(percentageChange) && isFinite(percentageChange)) {
            return percentageChange.toFixed(3);
        } else {
            return 0;
        }
    }
}

  currentmonth() {
    return this.dataSource.data.map(t => t.currentmonthwou);
  }
  lastmonth() {
    return this.dataSource.data.map(t => t.lastmonthwou);
  }
  lastlastmonth() {
    return this.dataSource.data.map(t => t.lastlastmonthwou);
  }
  currentmonthecosystem() {
    return this.dataSource.data.map(t => t.currentmonthecosystem);
  }
  lastmonthecosystem() {
    return this.dataSource.data.map(t => t.lastmonthecosystem);
  }
  lastlastmonthecosystem() {
    return this.dataSource.data.map(t => t.lastlastmonthecosystem);
  }
  currentmonthemiecosystem() {
    return this.dataSource.data.map(t => t.currentmonthemiecosystem);
  }
  lastmonthemiecosystem() {
    return this.dataSource.data.map(t => t.lastmonthemiecosystem);
  }
  lastlastmonthemiecosystem() {
    return this.dataSource.data.map(t => t.lastlastmonthemiecosystem);
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
  lastlastweektpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastlastweektpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastlastweek, 0);
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
  lastlastmonthtpv() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastlastmonthtpv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastlastmonth, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }

  currentweeklt() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweekltv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentweekparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastweeklt() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweekltv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastweekparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  currentmonthlt() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthltv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.currentmonthparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  lastmonthlt() {
    const totalTPV = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthltv, 0);
    const totalCount = this.dataSource.data.reduce((sum, entry) => sum + entry.lastmonthparticipant, 0);
    const averageTPV = totalCount !== 0 ? totalTPV / totalCount : 0;
    return averageTPV.toFixed(2);
  }
  
  fetchdata(){
    var currentDate = new Date();
    var dayOfWeek = currentDate.getDay();
    var sundayDiff = dayOfWeek;
    var saturdayDiff = 6 - dayOfWeek;
    
    var startOfDayHours = 0;
    var startOfDayMinutes = 0;

    var endOfDayHours = 23;
    var endOfDayMinutes = 59;
    
    var sundayDate = new Date(currentDate);
    sundayDate.setDate(currentDate.getDate() - sundayDiff);
    sundayDate.setHours(startOfDayHours);
    sundayDate.setMinutes(startOfDayMinutes);
    
    var saturdayDate = new Date(currentDate);
    saturdayDate.setDate(currentDate.getDate() + saturdayDiff);
    saturdayDate.setHours(endOfDayHours);
    saturdayDate.setMinutes(endOfDayMinutes);
    
    var lastSaturdayDate = new Date(currentDate);
    lastSaturdayDate.setDate(currentDate.getDate() - (dayOfWeek + 1)); 
    lastSaturdayDate.setHours(endOfDayHours);
    lastSaturdayDate.setMinutes(endOfDayMinutes);
    
    var lastSundayDate = new Date(lastSaturdayDate);
    lastSundayDate.setDate(lastSaturdayDate.getDate() - 6);
    lastSundayDate.setHours(startOfDayHours);
    lastSundayDate.setMinutes(startOfDayMinutes);
    
    var lastlastSaturdayDate = new Date(currentDate);
    lastlastSaturdayDate.setDate(currentDate.getDate() - (dayOfWeek + 8)); 
    lastlastSaturdayDate.setHours(endOfDayHours);
    lastlastSaturdayDate.setMinutes(endOfDayMinutes);
    
    var lastlastSundayDate = new Date(lastlastSaturdayDate);
    lastlastSundayDate.setDate(lastlastSaturdayDate.getDate() - 6); 
    lastlastSundayDate.setHours(startOfDayHours);
    lastlastSundayDate.setMinutes(startOfDayMinutes);
    
    console.log("currentSunday " , sundayDate);
    console.log("currentSaturday " , saturdayDate);
    console.log("lastSunday", lastSundayDate);
    console.log("lastSaturday ", lastSaturdayDate);
     console.log("lastlastsunday", lastlastSundayDate);
     console.log("lastlastsaturday", lastlastSaturdayDate);
  
    var startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    var startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    var endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    var startOflastlasttMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() -2, 1);
    var endOflastlastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() -1, 0);
 
  
    console.log("Start of current month:", startOfCurrentMonth);
    console.log("End of current month:", endOfCurrentMonth);
    console.log("Start of last month:", startOfLastMonth);
    console.log("End of last month:", endOfLastMonth);
    console.log('start of lastlast month', startOflastlasttMonth);
    console.log("end of lastlast month", endOflastlastMonth);
    const campaigns = [
      { campaignname: 'entries', startdate: sundayDate, enddate: saturdayDate, label: 'currentweeklead' ,tag: 'week'},
      { campaignname: 'lylregistration', startdate: sundayDate, enddate: saturdayDate, label: 'currentweeklead',tag: 'week' },
      { campaignname: 'leads', startdate: sundayDate, enddate: saturdayDate, label: 'currentweek',tag: 'week' },
      { campaignname: 'funnelmc', startdate: sundayDate, enddate: saturdayDate, label: 'currentweek',tag: 'week' },

      { campaignname: 'entries', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweeklead',tag: 'week' },
      { campaignname: 'lylregistration', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweeklead',tag: 'week' },
      { campaignname: 'leads', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweek',tag: 'week' },
      { campaignname: 'funnelmc', startdate: lastSundayDate, enddate: lastSaturdayDate, label: 'lastweek',tag: 'week' },

      { campaignname: 'entries', startdate: lastlastSundayDate, enddate: lastlastSaturdayDate, label: 'lastlastweeklead',tag: 'week' },
      { campaignname: 'lylregistration', startdate: lastlastSundayDate, enddate: lastlastSaturdayDate, label: 'lastlastweeklead',tag: 'week' },
      { campaignname: 'leads', startdate: lastlastSundayDate, enddate: lastlastSaturdayDate, label: 'lastlastweek',tag: 'week' },
      { campaignname: 'funnelmc', startdate: lastlastSundayDate, enddate: lastlastSaturdayDate, label: 'lastlastweek',tag: 'week' },

      { campaignname: 'entries', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonthlead',tag: 'month' },
      { campaignname: 'lylregistration', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonthlead',tag: 'month' },
      { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonth',tag: 'month' },
      { campaignname: 'funnelmc', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'currentmonth',tag: 'month' },

      { campaignname: 'entries', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonthlead',tag: 'month' },
      { campaignname: 'lylregistration', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonthlead',tag: 'month' },
      { campaignname: 'leads', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonth',tag: 'month' },
      { campaignname: 'funnelmc', startdate: startOfLastMonth, enddate: endOfLastMonth, label: 'lastmonth',tag: 'month' },

      { campaignname: 'entries', startdate: startOflastlasttMonth, enddate: endOflastlastMonth, label: 'lastlastmonthlead',tag: 'month' },
      { campaignname: 'lylregistration', startdate: startOflastlasttMonth, enddate: endOflastlastMonth, label: 'lastlastmonthlead',tag: 'month' },
      { campaignname: 'leads', startdate: startOflastlasttMonth, enddate: endOflastlastMonth, label: 'lastlastmonth',tag: 'month' },
      { campaignname: 'funnelmc', startdate: startOflastlasttMonth, enddate: endOflastlastMonth, label: 'lastlastmonth',tag: 'month' },
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
  let totalsales = 0;
  let totalltpurchasevalue =0;
  let totalsalewou =0;
  for (let i = 0; i <= numberOfDays; i++) {
    const date = this.getDateFormatted(i, startDate);    
    const count = countsByDate[date] || 0;
    totalcount +=count;
    const adjuststartdate = new Date(2024, 4, 1); 
    totalsales = await this.gettotalsales(startDate,endDate,label, campaignName);
    totalPurchaseValue = await this.getTotalPurchaseValueForDate(startDate,endDate,label, campaignName);
    totalemisubsale = await this.getecosystem(startDate,endDate,label,campaignName);
    totalsubsale = await this.getemiecosystem(startDate,endDate,label,campaignName);
    totalparticipant = await this.getparticipant(adjuststartdate,endDate,label,campaignName);
    totalfreetopaid = await this.getfreetopaid(startDate,endDate,label,campaignName);
    totalltpurchasevalue = await this.getltpurchasevalue(adjuststartdate,endDate,label,campaignName);
    totalsalewou = await this.gettotalpurchase(startDate,endDate,label,campaignName);
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

      if (campaignName === 'entries' && label === 'lastlastweeklead') {
        this.dataSource.data[existingDataIndex]['lastlastweeklead'] = totalcount ;
        this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] = totalfreetopaid ;
        }
        if (label === 'lastlastweeklead' && (campaignName === 'lylregistration') )  {
          this.dataSource.data[existingDataIndex]['lastlastweeklead'] =this.dataSource.data[existingDataIndex]['lastlastweeklead']+ totalcount ;
          this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] = this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] + totalfreetopaid ;
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

      if (campaignName === 'entries' && label === 'lastlastmonthlead') {
        this.dataSource.data[existingDataIndex]['lastlastmonthlead'] = totalcount;
        this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] = totalfreetopaid;
        }
        if (label === 'lastlastmonthlead' && (campaignName === 'lylregistration') )  {
          this.dataSource.data[existingDataIndex]['lastlastmonthlead'] =this.dataSource.data[existingDataIndex]['lastlastmonthlead']+ totalcount ;
          this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] = this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] + totalfreetopaid;
         }

    if (label === 'currentweek' && (campaignName === 'leads') )  {
     this.dataSource.data[existingDataIndex]['currentweek'] = totalsales ;
     this.dataSource.data[existingDataIndex]['currentweektpv'] = totalPurchaseValue;
     this.dataSource.data[existingDataIndex]['currentweekwou'] = totalsalewou ;
     this.dataSource.data[existingDataIndex]['currentweekecosystem'] = totalemisubsale;
     this.dataSource.data[existingDataIndex]['currentweekemiecosystem'] = totalsubsale;
     this.dataSource.data[existingDataIndex]['currentweekparticipant'] = totalparticipant;
     this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = totalfreetopaid ;
     this.dataSource.data[existingDataIndex]['currentweekltv'] = totalltpurchasevalue;
    }
    if (label === 'currentweek' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['currentweek'] = this.dataSource.data[existingDataIndex]['currentweek']+ totalsales  ;
      this.dataSource.data[existingDataIndex]['currentweekwou'] = this.dataSource.data[existingDataIndex]['currentweekwou']+ totalsalewou  ;
      this.dataSource.data[existingDataIndex]['currentweekparticipant'] = this.dataSource.data[existingDataIndex]['currentweekparticipant'] +totalparticipant +2212 +765;
      this.dataSource.data[existingDataIndex]['currentweektpv'] = this.dataSource.data[existingDataIndex]['currentweektpv']  + totalPurchaseValue;
      this.dataSource.data[existingDataIndex]['currentweekltv'] = this.dataSource.data[existingDataIndex]['currentweekltv']  + totalltpurchasevalue + 967665115 +1311268;
      this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] = this.dataSource.data[existingDataIndex]['currentweekfreetopaid'] + totalfreetopaid ;
     }
    if (campaignName === 'leads' && label === 'lastweek') {
    this.dataSource.data[existingDataIndex]['lastweek'] = totalsales ;
    this.dataSource.data[existingDataIndex]['lastweekwou'] = totalsalewou ;
    this.dataSource.data[existingDataIndex]['lastweektpv'] = totalPurchaseValue ;
    this.dataSource.data[existingDataIndex]['lastweekltv'] = totalltpurchasevalue ;
    this.dataSource.data[existingDataIndex]['lastweekecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['lastweekemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['lastweekparticipant'] = totalparticipant;
    this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = totalfreetopaid ;
    }
    if (label === 'lastweek' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['lastweek'] =this.dataSource.data[existingDataIndex]['lastweek']+ totalsales ;
      this.dataSource.data[existingDataIndex]['lastweekwou'] =this.dataSource.data[existingDataIndex]['lastweekwou']+ totalsalewou ;
      this.dataSource.data[existingDataIndex]['lastweektpv'] =this.dataSource.data[existingDataIndex]['lastweektpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['lastweekltv'] =this.dataSource.data[existingDataIndex]['lastweekltv']+ totalltpurchasevalue + 967665115 +1311268;
      this.dataSource.data[existingDataIndex]['lastweekparticipant'] =this.dataSource.data[existingDataIndex]['lastweekparticipant'] + totalparticipant  +2212 +765;
      this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] = this.dataSource.data[existingDataIndex]['lastweekfreetopaid'] + totalfreetopaid ;
     }

     if (campaignName === 'leads' && label === 'lastlastweek') {
      this.dataSource.data[existingDataIndex]['lastlastweek'] = totalsales ;
      this.dataSource.data[existingDataIndex]['lastlastweekwou'] = totalsalewou ;
      this.dataSource.data[existingDataIndex]['lastlastweektpv'] = totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['lastlastweekltv'] = totalltpurchasevalue ;
      this.dataSource.data[existingDataIndex]['lastlastweekecosystem'] = totalemisubsale;
      this.dataSource.data[existingDataIndex]['lastlastweekemiecosystem'] = totalsubsale;
      this.dataSource.data[existingDataIndex]['lastlastweekparticipant'] = totalparticipant;
      this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] = totalfreetopaid ;
      }
      if (label === 'lastlastweek' && (campaignName === 'funnelmc') )  {
        this.dataSource.data[existingDataIndex]['lastlastweek'] =this.dataSource.data[existingDataIndex]['lastlastweek']+ totalsales ;
        this.dataSource.data[existingDataIndex]['lastlastweekwou'] =this.dataSource.data[existingDataIndex]['lastlastweekwou']+ totalsalewou ;
        this.dataSource.data[existingDataIndex]['lastlastweektpv'] =this.dataSource.data[existingDataIndex]['lastlastweektpv']+ totalPurchaseValue ;
        this.dataSource.data[existingDataIndex]['lastlastweekltv'] =this.dataSource.data[existingDataIndex]['lastlastweekltv']+ totalltpurchasevalue + 967665115 +1311268;
        this.dataSource.data[existingDataIndex]['lastlastweekparticipant'] =this.dataSource.data[existingDataIndex]['lastlastweekparticipant'] + totalparticipant  +2212 +765;
        this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] = this.dataSource.data[existingDataIndex]['lastlastweekfreetopaid'] + totalfreetopaid ;
       }

    if (campaignName === 'leads' && label === 'currentmonth') {
    this.dataSource.data[existingDataIndex]['currentmonth'] = totalsales;
    this.dataSource.data[existingDataIndex]['currentmonthwou'] = totalsalewou;
    this.dataSource.data[existingDataIndex]['currentmonthecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['currentmonthemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['currentmonthparticipant'] = totalparticipant;
    this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] = totalfreetopaid;
    this.dataSource.data[existingDataIndex]['currentmonthtpv'] = totalPurchaseValue;
    this.dataSource.data[existingDataIndex]['currentmonthltv'] = totalltpurchasevalue;
    }
    if (label === 'currentmonth' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['currentmonth'] =this.dataSource.data[existingDataIndex]['currentmonth']+ totalsales ;
      this.dataSource.data[existingDataIndex]['currentmonthwou'] =this.dataSource.data[existingDataIndex]['currentmonthwou']+ totalsalewou ;
      this.dataSource.data[existingDataIndex]['currentmonthtpv'] =this.dataSource.data[existingDataIndex]['currentmonthtpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['currentmonthltv'] =this.dataSource.data[existingDataIndex]['currentmonthltv']+ totalltpurchasevalue + 967665115 +1311268;
      this.dataSource.data[existingDataIndex]['currentmonthparticipant'] =this.dataSource.data[existingDataIndex]['currentmonthparticipant'] + totalparticipant +2212 +765;
      this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] =this.dataSource.data[existingDataIndex]['currentmonthfreetopaid'] + totalfreetopaid;
     }
    if (campaignName === 'leads' && label === 'lastmonth') {
    this.dataSource.data[existingDataIndex]['lastmonth'] = totalsales;
    this.dataSource.data[existingDataIndex]['lastmonthwou'] = totalsalewou;
    this.dataSource.data[existingDataIndex]['lastmonthtpv'] = totalPurchaseValue;
    this.dataSource.data[existingDataIndex]['lastmonthltv'] = totalltpurchasevalue ;
    this.dataSource.data[existingDataIndex]['lastmonthecosystem'] = totalemisubsale;
    this.dataSource.data[existingDataIndex]['lastmonthemiecosystem'] = totalsubsale;
    this.dataSource.data[existingDataIndex]['lastmonthparticipant'] = totalparticipant ;
    this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = totalfreetopaid;
    }
    if (label === 'lastmonth' && (campaignName === 'funnelmc') )  {
      this.dataSource.data[existingDataIndex]['lastmonth'] =this.dataSource.data[existingDataIndex]['lastmonth']+ totalsales ;
      this.dataSource.data[existingDataIndex]['lastmonthwou'] =this.dataSource.data[existingDataIndex]['lastmonthwou']+ totalsalewou ;
      this.dataSource.data[existingDataIndex]['lastmonthtpv'] =this.dataSource.data[existingDataIndex]['lastmonthtpv']+ totalPurchaseValue ;
      this.dataSource.data[existingDataIndex]['lastmonthltv'] =this.dataSource.data[existingDataIndex]['lastmonthltv']+ totalltpurchasevalue + 967665115 +1311268;
      this.dataSource.data[existingDataIndex]['lastmonthparticipant'] =this.dataSource.data[existingDataIndex]['lastmonthparticipant'] + totalparticipant +2212 +765;
      this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] = this.dataSource.data[existingDataIndex]['lastmonthfreetopaid'] + totalfreetopaid;
     }

     if (campaignName === 'leads' && label === 'lastlastmonth') {
      this.dataSource.data[existingDataIndex]['lastlastmonth'] = totalsales;
      this.dataSource.data[existingDataIndex]['lastlastmonthwou'] = totalsalewou;
      this.dataSource.data[existingDataIndex]['lastlastmonthtpv'] = totalPurchaseValue;
      this.dataSource.data[existingDataIndex]['lastlastmonthltv'] = totalltpurchasevalue ;
      this.dataSource.data[existingDataIndex]['lastlastmonthecosystem'] = totalemisubsale;
      this.dataSource.data[existingDataIndex]['lastlastmonthemiecosystem'] = totalsubsale;
      this.dataSource.data[existingDataIndex]['lastlastmonthparticipant'] = totalparticipant ;
      this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] = totalfreetopaid;
      }
      if (label === 'lastlastmonth' && (campaignName === 'funnelmc') )  {
        this.dataSource.data[existingDataIndex]['lastlastmonth'] =this.dataSource.data[existingDataIndex]['lastlastmonth']+ totalsales ;
        this.dataSource.data[existingDataIndex]['lastlastmonthwou'] =this.dataSource.data[existingDataIndex]['lastlastmonthwou']+ totalsalewou ;
        this.dataSource.data[existingDataIndex]['lastlastmonthtpv'] =this.dataSource.data[existingDataIndex]['lastlastmonthtpv']+ totalPurchaseValue ;
        this.dataSource.data[existingDataIndex]['lastlastmonthltv'] =this.dataSource.data[existingDataIndex]['lastlastmonthltv']+ totalltpurchasevalue + 967665115 +1311268;
        this.dataSource.data[existingDataIndex]['lastlastmonthparticipant'] =this.dataSource.data[existingDataIndex]['lastlastmonthparticipant'] + totalparticipant +2212 +765;
        this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] = this.dataSource.data[existingDataIndex]['lastlastmonthfreetopaid'] + totalfreetopaid;
       }

  }
   else {
    const newDataItem = {
      date: 'data',
      currentweek: campaignName === 'leads' ? totalsales : 0,
      lastweek: campaignName === 'leads' ? totalsales : 0,
      lastlastweek: campaignName === 'leads' ? totalsales : 0,
      currentmonth: campaignName === 'leads' ? totalsales : 0,
      lastmonth: campaignName === 'leads' ? totalsales : 0,
      lastlastmonth: campaignName === 'leads' ? totalsales : 0,
      currentweeklead: campaignName === 'entries' ? totalcount : 0,
      lastlastweeklead: campaignName === 'entries' ? totalcount : 0,
      currentmonthlead: campaignName === 'entries' ? totalcount : 0,
      lastlastmonthlead: campaignName === 'entries' ? totalcount : 0,
      lastweeklead: campaignName === 'entries' ? totalcount : 0,
      lastmonthlead: campaignName === 'entries' ? totalcount : 0,
      currentweektpv: campaignName === 'leads' ? tpv : 0,
      lastweektpv: campaignName === 'leads' ? tpv : 0,
      lastlastweektpv: campaignName === 'leads' ? tpv : 0,
      currentmonthtpv: campaignName === 'leads' ? tpv : 0,
      lastmonthtpv: campaignName === 'leads' ? tpv : 0,
      lastlastmonthtpv: campaignName === 'leads' ? tpv : 0,
      currentweekecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      lastweekecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      lastlastweekecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      currentmonthecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      lastmonthecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      lastlastmonthecosystem: campaignName === 'leads' ? totalemisubsale : 0,
      currentweekemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      lastweekemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      lastlastweekemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      currentmonthemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      lastmonthemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      lastlastmonthemiecosystem: campaignName === 'leads' ? totalsubsale : 0,
      currentweekparticipant: campaignName === 'leads' ? totalparticipant : 0,
      lastweekparticipant: campaignName === 'leads' ? totalparticipant : 0,
      lastlastweekparticipant: campaignName === 'leads' ? totalparticipant : 0,
      currentmonthparticipant: campaignName === 'leads' ? totalparticipant : 0,
      lastmonthparticipant: campaignName === 'leads' ? totalparticipant : 0,
      lastlastmonthparticipant: campaignName === 'leads' ? totalparticipant : 0,
      currentweekfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      lastweekfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      lastlastweekfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      currentmonthfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      lastmonthfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      lastlastmonthfreetopaid: campaignName === 'leads' ? totalfreetopaid : 0,
      currentweekltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      lastweekltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      lastlastweekltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      currentmonthltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      lastmonthltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      lastlastmonthltv: campaignName === 'leads' ? totalltpurchasevalue : 0,
      currentweekwou: campaignName === 'leads' ? totalsalewou : 0,
      lastweekwou: campaignName === 'leads' ? totalsalewou : 0,
      lastlastweekwou: campaignName === 'leads' ? totalsalewou : 0,
      currentmonthwou: campaignName === 'leads' ? totalsalewou : 0,
      lastmonthwou: campaignName === 'leads' ? totalsalewou : 0,
      lastlastmonthwou: campaignName === 'leads' ? totalsalewou : 0,
    };
    
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
          totalPurchaseValue += (entry.totalpurchasevalue || 0);
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += (entry.ordertotal || 0);
        }
      });
      resolve(totalPurchaseValue);
    }, error => {
      reject(error);
    });
  });
}

async getltpurchasevalue(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let totalPurchaseValue = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if (campaignName === 'leads' && label === 'currentweek') {
          totalPurchaseValue += (entry.totalpurchasevalue  || 0) ;
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += entry.ordertotal || 0;
        }
        if (campaignName === 'leads' && label === 'lastweek') {
          totalPurchaseValue += (entry.totalpurchasevalue || 0) ;
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += (entry.ordertotal || 0) ;
        }
        if (campaignName === 'leads' && label === 'lastmonth') {
          totalPurchaseValue += (entry.totalpurchasevalue  || 0);
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += entry.ordertotal || 0;
        }
        if (campaignName === 'leads' && label === 'currentmonth') {
          totalPurchaseValue += (entry.totalpurchasevalue  || 0) ;
        } else if (campaignName === 'funnelmc') {
          totalPurchaseValue += (entry.ordertotal) || 0;
        }
      });
      resolve(totalPurchaseValue);
    }, error => {
      reject(error);
    });
  });
}

async gettotalsales(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let count = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if (campaignName === 'leads' && (entry.journeyname !== 'FTO') ) {
          count += 1 || 0;
          //console.log(entry.email)
        } else if (campaignName === 'funnelmc') {
          count += 1 || 0;
        }
      });
      resolve(count);
    }, error => {
      reject(error);
    });
  });
}

async gettotalpurchase(startDate: Date, endDate: Date, label: string, campaignName: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let count = 0;
    const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';

    this.firestore.collection<any>(campaignName, ref =>
      ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
         .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
    ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
      entries.forEach(entry => {
        if (campaignName === 'leads' && entry.journeyname !== 'FTO' && entry.saletype !== 'upgrade') {
          count += 1 ;
        } else if (campaignName === 'funnelmc') {
          count += 1 ;
        }
      });
      resolve(count);
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
         // console.log(email)
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
          //console.log(email)
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
        if (!uniqueEmails.has(email) && label === 'currentweek') { 
          uniqueEmails.add(email);
          if(campaignName === 'leads'){
          count += 1;
          }
          else if ( campaignName === 'funnelmc'){
            count += 1;
          }
        }
        if (!uniqueEmails.has(email) && label === 'lastweek') { 
          uniqueEmails.add(email);
          if(campaignName === 'leads'){
          count += 1;
          }
          else if ( campaignName === 'funnelmc' && label === 'lastweek'){
            count += 1;
          }
        }
        if (!uniqueEmails.has(email) && label === 'currentmonth') { 
          uniqueEmails.add(email);
          if(campaignName === 'leads'){
          count +=1;
          }
          else if ( campaignName === 'funnelmc'){
            count += 1;
          }
        }
        if (!uniqueEmails.has(email) && label === 'lastmonth') { 
          uniqueEmails.add(email);
          if(campaignName === 'leads'){
          count += 1;
          }
          else if (label === 'lastmonth' && campaignName === 'funnelmc'){
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