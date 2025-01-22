// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { MatTableDataSource } from '@angular/material/table';
// import { map, takeUntil } from 'rxjs/operators';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import { Observable, Subject } from 'rxjs';
// import { Timestamp } from 'rxjs/internal/operators/timestamp';
// import * as XLSX from 'xlsx';

// // interface CampaignData {
// //   month: string,
// //   CTD: number,
// //   CriticalSupport: number,
// //   BiG: number,
// //   SuperMetabolismProgram: number,
// //   HighPerformanceDelivered: number,
// //   uP: number,
// //   FTM: number,
// //   HealthExplorative: number,
// //   WiSH: number,
// //   BiGContinuity: number,
// //   CPMupgrade: number,
// //   LaunchYourLegacyL2: number,
// //   EIStarterPack: number,
// //   EISubscriptionforEntrepreneurs: number,
//   // lCTD: number,
//   // lCriticalSupport: number,
//   // lBiG: number,
//   // lSuperMetabolismProgram: number,
//   // lHighPerformanceDelivered: number,
//   // luP: number,
//   // lFTM: number,
//   // lHealthExplorative: number,
//   // lWiSH: number,
//   // lBiGContinuity: number,
//   // lCPMupgrade: number,
//   // lLaunchYourLegacyL2: number,
//   // lEIStarterPack: number,
//   // lEISubscriptionforEntrepreneurs: number,
//   // pCTD: number,
//   // pCriticalSupport: number,
//   // pBiG: number,
//   // pSuperMetabolismProgram: number,
//   // pHighPerformanceDelivered: number,
//   // puP: number,
//   // pFTM: number,
//   // pHealthExplorative: number,
//   // pWiSH: number,
//   // pBiGContinuity: number,
//   // pCPMupgrade: number,
//   // pLaunchYourLegacyL2: number,
//   // pEIStarterPack: number,
//   // pEISubscriptionforEntrepreneurs: number
// // }

// export interface DialogData {
//   name: string;
//   mobile: string;
//   email: string;
//   totalpurchasevalue: string;
//   converteddate: string;
// }

// // interface DialogData {
// //   BiG: number;
// //   BiGContinuity: number;
// //   CPMupgrade: number;
// //   CTD: number;
// //   CriticalSupport: number;
// //   EIStarterpack: number;
// //   EIsubscriptionforEntrepreneurs: number;
// //   FTM: number;
// //   HealthExplorative: number;
// //   HighPerformancedelivered: number;
// //   LYLL2: number;
// //   SMP: number;
// //   Wish: number;
// //   uP: number;
// // }

// @Component({
//   selector: 'app-dashboarddialog',
//   templateUrl: './dashboarddialog.component.html',
//   styleUrls: ['./dashboarddialog.component.css']
// })
// export class DashboarddialogComponent implements OnInit {
//   fileName = 'ExportExcel.xlsx';
//   private unsubscribe$ = new Subject<void>();
//   penultimateMonthData: DialogData | null = null;
//   lastMonthData: DialogData | null = null;
//   dataArray: any[] = [];
//   data$: Observable<any>;
//   opportunities: Observable<any>;
//   dataSourceopportunities = new MatTableDataSource<DialogData>();
//   displayedColumns: string[] = ['name', 'email', 'mobile', 'totalpurchasevalue', 'converteddate'];

//   //dataSource = new MatTableDataSource<CampaignData>();

//   constructor(private firestore: AngularFirestore) {
//     this.opportunities = this.firestore.collection<DialogData>('leads').valueChanges();
//     this.opportunities.subscribe(data => {
//       this.dataSourceopportunities.data = data;
//     });

//     // this.data$ = this.firestore.collection<any>('dialog').valueChanges();
//     this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
//       console.log('Data from Firestore:', data);

//       // Sort data in descending order based on converteddate
//       data.sort((a: DialogData, b: DialogData) => {
//         const dateA = new Date(a.converteddate).getTime();
//         const dateB = new Date(b.converteddate).getTime();
//         return dateB - dateA;  // Descending order
//       });

//       if (data.length >= 2) {
//         // Assign the last two items as penultimate and last month data
//         this.penultimateMonthData = data[1];
//         this.lastMonthData = data[0];
//         this.dataArray = Object.entries(this.penultimateMonthData);
//         console.log('Penultimate Month Data:', this.penultimateMonthData);
//         console.log('Last Month Data:', this.lastMonthData);
//       }
//     });
//   }

//   ngOnInit(): void {
//     //this.fetchdata();
//   }

//   // fetchdata(): void {
//   //   // Your fetch logic here
//   // }

//   exportexcel(): void {
//     TableUtil.exportToExcel("exampleTable");
//   }


//   // objectKeys(item: any): string[] {
//   //   return Object.keys(item).filter(key => key !== 'month');
//   // }

//   // fetchdata(){
//   //   var currentDate = new Date();
//   //   var startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//   //   var endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//   //   const campaigns = [
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'CTD', tag:'currentmonth' },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'Critical Support', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'BiG', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'Super Metabolism Program', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'High Performance Delivered', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'uP!', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'FTM', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'Health Explorative', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'WiSH', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'BiG Continuity', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'CPM upgrade', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'Launch Your Legacy L2', tag:'currentmonth'  },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'EI StarterPack' , tag:'currentmonth' },
//   //     { campaignname: 'leads', startdate: startOfCurrentMonth, enddate: endOfCurrentMonth, label: 'EI Subscription for Entrepreneurs', tag:'currentmonth'  },
      
//   //   ];

//   //   campaigns.forEach(campaign => {
//   //     this.firestore.collection<any>(campaign.campaignname, ref =>
//   //       ref.where((campaign.campaignname === 'leads' ? 'converteddate' : 'createddate') , '>=',firebase.firestore.Timestamp.fromDate(campaign.startdate))
//   //          .where((campaign.campaignname === 'leads' ? 'converteddate' : 'createddate'), '<=',firebase.firestore.Timestamp.fromDate(campaign.enddate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$),
//   //       map(entries => {
//   //         const countsByDate: { [key: string]: number } = {};
//   //         entries.forEach(entry => {
//   //           const dateField = (campaign.campaignname === 'leads' ? 'converteddate' : '') ;
//   //           const date = entry[dateField].toDate();
//   //           const dateString = this.formatDate(date);
//   //           countsByDate[dateString] = (countsByDate[dateString] || 0) + 1;
//   //         });
//   //         return { countsByDate, campaignName: campaign.campaignname, label: campaign.label,tag: campaign.tag };
//   //       })
//   //     ).subscribe(({ countsByDate, campaignName, label,tag }) => {
//   //       this.populateDataSource(campaign.startdate, campaign.enddate, countsByDate, campaignName, label,tag);
//   //     });
//   //   });

//   // }

//   // async populateDataSource(startDate: Date, endDate: Date, countsByDate: { [key: string]: number }, campaignName: string, label: string, tag:string) {
//   //   const numberOfDays = this.getDifferenceInDays(startDate, endDate);
//   //   var totalcount =0; 
//   //   var totalcountcs =0;
//   //   var totalcountbg =0;
//   //   var totalcountsmp =0;
//   //   var totalcounthp =0;
//   //   var totalcountup =0;
//   //   var totalcountftm =0;
//   //   var totalcounthe =0;
//   //   var totalcountws =0;
//   //   var totalcountbc =0;
//   //   var totalcountcpm =0;
//   //   var totalcountlyl =0;
//   //   var totalcountei =0;
//   //   var totalcounteis =0;
//   //   let totcount = 0;
//   //   for (let i = 0; i <= numberOfDays; i++) {
//   //     const date = this.getDateFormatted(i, startDate);    
//   //     const count = countsByDate[date] || 0;
//   //     totcount +=count;
//   //     totalcount = await this.getcount(startDate,endDate,label,campaignName,tag);
//   //     totalcountcs = await this.getcount1(startDate,endDate,label,campaignName,tag);
//   //     totalcountbg = await this.getcount2(startDate,endDate,label,campaignName,tag);
//   //     totalcountsmp = await this.getcount3(startDate,endDate,label,campaignName,tag);
//   //     totalcounthp = await this.getcount4(startDate,endDate,label,campaignName,tag);
//   //     totalcountup = await this.getcount5(startDate,endDate,label,campaignName,tag);
//   //     totalcountftm = await this.getcount6(startDate,endDate,label,campaignName,tag);
//   //     totalcounthe = await this.getcount7(startDate,endDate,label,campaignName,tag);
//   //     totalcountws = await this.getcount8(startDate,endDate,label,campaignName,tag);
//   //     totalcountbc = await this.getcount9(startDate,endDate,label,campaignName,tag);
//   //     totalcountcpm = await this.getcount0(startDate,endDate,label,campaignName,tag);
//   //     totalcountlyl = await this.getcount11(startDate,endDate,label,campaignName,tag);
//   //     totalcountei = await this.getcount12(startDate,endDate,label,campaignName,tag);
//   //     totalcounteis = await this.getcount13(startDate,endDate,label,campaignName,tag);
//   //   }

//   //   const existingDataIndex = this.dataSource.data.findIndex(d => d.month === 'data');
//   //   if (existingDataIndex !== -1) {

//   //     if (tag === 'currentmonth' && (campaignName === 'leads') )  {
//   //       this.dataSource.data[existingDataIndex]['CTD'] = totalcount ;
//   //       this.dataSource.data[existingDataIndex]['CriticalSupport'] = totalcountcs ;
//   //       this.dataSource.data[existingDataIndex]['BiG'] = totalcountbg ;
//   //       this.dataSource.data[existingDataIndex]['SuperMetabolismProgram'] = totalcountsmp ;
//   //       this.dataSource.data[existingDataIndex]['HighPerformanceDelivered'] = totalcounthp ;
//   //       this.dataSource.data[existingDataIndex]['uP'] = totalcountup ;
//   //       this.dataSource.data[existingDataIndex]['FTM'] = totalcountftm ;
//   //       this.dataSource.data[existingDataIndex]['HealthExplorative'] = totalcounthe ;
//   //       this.dataSource.data[existingDataIndex]['WiSH'] = totalcountws ;
//   //       this.dataSource.data[existingDataIndex]['BiGContinuity'] = totalcountbc ;
//   //       this.dataSource.data[existingDataIndex]['CPMupgrade'] = totalcountcpm ;
//   //       this.dataSource.data[existingDataIndex]['LaunchYourLegacyL2'] = totalcountlyl ;
//   //       this.dataSource.data[existingDataIndex]['EIStarterPack'] = totalcountei ;
//   //       this.dataSource.data[existingDataIndex]['EISubscriptionforEntrepreneurs'] = totalcounteis ;
//   //      } 
       
//   //     }
//   //     else {
//   //       const newDataItem = {
//   //         month: 'data',
//   //         CTD : campaignName === 'leads' ? totalcount : 0,
//   //         CriticalSupport : campaignName === 'leads' ? totalcount : 0,
//   //         BiG : campaignName === 'leads' ? totalcount : 0,
//   //         SuperMetabolismProgram : campaignName === 'leads' ? totalcount : 0,
//   //         HighPerformanceDelivered : campaignName === 'leads' ? totalcount : 0,
//   //         uP : campaignName === 'leads' ? totalcount : 0,
//   //         FTM : campaignName === 'leads' ? totalcount : 0,
//   //         HealthExplorative : campaignName === 'leads' ? totalcount : 0,
//   //         WiSH : campaignName === 'leads' ? totalcount : 0,
//   //         BiGContinuity : campaignName === 'leads' ? totalcount : 0,
//   //         CPMupgrade : campaignName === 'leads' ? totalcount : 0,
//   //         LaunchYourLegacyL2 : campaignName === 'leads' ? totalcount : 0,
//   //         EIStarterPack : campaignName === 'leads' ? totalcount : 0,
//   //         EISubscriptionforEntrepreneurs : campaignName === 'leads' ? totalcount : 0,

//   //       };
//   //       this.dataSource.data.push(newDataItem);
//   //     }
//   //     this.dataSource.data = [...this.dataSource.data];
//   //     console.log(this.dataSource.data)
//   //     //this.updatesource();

//   //   }

//   // //   updatesource(){
//   // //     const item = this.dataSource.data[0]; 

//   // //     this.dataSource.data.forEach(item => {
//   // //       this.penultimateMonthData.push({
//   // //         CTD: item.pCTD,
//   // //         CriticalSupport: item.pCriticalSupport,
//   // //         BiG: item.pBiG,
//   // //         SMP: item.pSuperMetabolismProgram,
//   // //         HighPerformancedelivered: item.pHighPerformanceDelivered,
//   // //         uP: item.puP,
//   // //         FTM: item.pFTM,
//   // //         HealthExplorative: item.pHealthExplorative,
//   // //         Wish: item.pWiSH,
//   // //         BiGContinuity: item.pBiGContinuity,
//   // //         CPMupgrade: item.pCPMupgrade,
//   // //         LYLL2: item.pLaunchYourLegacyL2,
//   // //         EIStarterpack: item.pEIStarterPack,
//   // //         EIsubscriptionforEntrepreneurs: item.pEISubscriptionforEntrepreneurs
  
//   // //       });
  
//   // //       this.lastMonthData.push({
//   // //         CTD: item.lCTD,
//   // //         CriticalSupport: item.lCriticalSupport,
//   // //         BiG: item.lBiG,
//   // //         SMP: item.lSuperMetabolismProgram,
//   // //         HighPerformancedelivered: item.lHighPerformanceDelivered,
//   // //         uP: item.luP,
//   // //         FTM: item.lFTM,
//   // //         HealthExplorative: item.lHealthExplorative,
//   // //         Wish: item.lWiSH,
//   // //         BiGContinuity: item.lBiGContinuity,
//   // //         CPMupgrade: item.lCPMupgrade,
//   // //         LYLL2: item.lLaunchYourLegacyL2,
//   // //         EIStarterpack: item.lEIStarterPack,
//   // //         EIsubscriptionforEntrepreneurs: item.lEISubscriptionforEntrepreneurs
  
//   // //       });
//   // //     });
//   // //     this.pushDataToFirestore();

//   // //   }
  

//   // // pushDataToFirestore() {
//   // //   this.firestore.collection('dialog').doc('penultimateMonthData').set({ data: this.penultimateMonthData })
//   // //     .then(() => console.log('Penultimate month data added to Firestore'))
//   // //     .catch((error) => console.error('Error adding penultimate month data: ', error));

//   // //   this.firestore.collection('dialog').doc('lastMonthData').set({ data: this.lastMonthData })
//   // //     .then(() => console.log('Last month data added to Firestore'))
//   // //     .catch((error) => console.error('Error adding last month data: ', error));
//   // // }

//   // async getcount(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'CTD') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }

//   // async getcount1(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if (entry.journeyname === 'Critical Support') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }

//   // async getcount2(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ((entry.journeyname === 'BiG' || entry.journeyname === 'BiG with SLD CI')) {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount3(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'Super Metabolism Program') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount4(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'High Performance Delivered') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount5(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'uP!') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount6(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( (entry.journeyname === 'FTM' || entry.journeyname === 'FastTrack Membership')) {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount7(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'Health Explorative') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount8(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if (entry.journeyname === 'WiSH') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount9(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'BiG Continuity') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount0(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'CPM upgrade') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount11(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'Launch Your Legacy L2') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount12(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if ( entry.journeyname === 'EI StarterPack') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }
//   // async getcount13(startDate: Date, endDate: Date, label: string, campaignName: string, tag: string): Promise<number> {
//   //   return new Promise<number>((resolve, reject) => {
//   //     let totalcount = 0;
//   //     let total =0;
//   //     const dateField = campaignName === 'leads' ? 'converteddate' : 'createddate';
  
//   //     this.firestore.collection<any>(campaignName, ref =>
//   //       ref.where(dateField, '>=', firebase.firestore.Timestamp.fromDate(startDate))
//   //          .where(dateField, '<=', firebase.firestore.Timestamp.fromDate(endDate))
//   //     ).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(entries => {
//   //       if (entries.length === 0) {
//   //         resolve(totalcount); 
//   //       }
//   //       entries.forEach(entry => {
//   //         if (entry.journeyname === 'EI Subscription for Entrepreneurs') {
//   //           totalcount  = totalcount + 1;
//   //         }
//   //       });
//   //       resolve(totalcount);
//   //     }, error => {
//   //       console.error('Error fetching data:', error);
//   //       reject(error);
//   //     });
//   //   });
//   // }

  
//   formatDate(date: Date): string {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   getDifferenceInDays(startDate: Date, endDate: Date): number {
//     const oneDay = 24 * 60 * 60 * 1000; 
//     const startDateTime = startDate.getTime();
//     const endDateTime = endDate.getTime();
//     return Math.round(Math.abs((endDateTime - startDateTime) / oneDay));
//   }

//   getDateFormatted(index: number, startDate: Date): string {
//     const date = new Date(startDate);
//     date.setDate(startDate.getDate() + index);
//     return this.formatDate(date);
//   }
// }

// export class TableUtil {
//   static exportToExcel(tableId: string, name?: string) {
//     let timeSpan = new Date().toISOString();
//     let prefix = name || "ExportResult";
//     let fileName = `${prefix}-${timeSpan}`;
//     let targetTableElm = document.getElementById(tableId);
    
//     if (targetTableElm) {
//       let wb = XLSX.utils.table_to_book(targetTableElm, { sheet: prefix });
//       XLSX.writeFile(wb, `${fileName}.xlsx`);
//     } else {
//       console.error(`Table with id '${tableId}' not found.`);
//     }
//   }
// }

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as XLSX from 'xlsx';

export interface DialogData {
  name: string;
  mobile: string;
  email: string;
  totalpurchasevalue: number;
  purchasedate: firebase.firestore.Timestamp; 
  journeyname: string;
  status: string;
}

@Component({
  selector: 'app-dashboarddialog',
  templateUrl: './dashboarddialog.component.html',
  styleUrls: ['./dashboarddialog.component.css']
})

export class DashboarddialogComponent implements OnInit, OnDestroy {
  fileName = 'ExportExcel.xlsx';
  private unsubscribe$ = new Subject<void>();
  dataSourceopportunities = new MatTableDataSource<DialogData>();
  displayedColumns: string[] = ['no','name', 'email', 'mobile', 'journeyname', 'totalpurchasevalue', 'converteddate','saletype'];
  dataforfilter = [];
  totalPurchaseValue: number = 0;
  journeyNames: string[] = [];
  
  startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
 
  dateRangeForm = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    journeyName: new FormControl([]) 
  });

  @ViewChild(MatSort) sort: MatSort;

  constructor(private firestore: AngularFirestore) {
    this.firestore.collection<DialogData>('convertedleads').valueChanges().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(data => {
      const filteredData = data.filter(item => (item.journeyname !== 'FTO' && item.journeyname !== 'Research' && item.status !== 'pending' && item.status !== 'Cancelled')  && item.totalpurchasevalue !== 0);

      filteredData.sort((a, b) => {
        const dateA = a.purchasedate.toDate().getTime();
        const dateB = b.purchasedate.toDate().getTime();
        return dateB - dateA;
      });
      this.dataSourceopportunities.data = filteredData;
      this.dataforfilter = this.dataSourceopportunities.data
      this.applyCurrentMonthFilter()
      this.extractJourneyNames();
      this.onDateRangeChange()
     // console.log(this.dataforfilter,this.dataSourceopportunities.data)
    });
  }

  ngOnInit(): void {
    this.dataSourceopportunities.sort = this.sort; 
  }
  extractJourneyNames(): void {
    const journeyNames = this.dataSourceopportunities.data
      .map(item => item.journeyname)
      .filter((value, index, self) => self.indexOf(value) === index); 

    this.journeyNames = journeyNames;
    // this.applyCurrentMonthFilter()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDateRangeChange(): void {
    const { start, end, journeyName } = this.dateRangeForm.value;
  
    if (start && end) {
      const fromDateTime = start.getTime();
      const toDateTime = end.getTime();
  
      this.dataSourceopportunities.data = this.dataforfilter;
  
      this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
        const itemDateTime = item.purchasedate.toDate().getTime();
        
        const journeyMatches = !journeyName.length || journeyName.includes(item.journeyname) || journeyName.includes(''); 
  
        return itemDateTime >= fromDateTime && itemDateTime <= toDateTime && journeyMatches;
      });
      this.calculateTotalPurchaseValue();
      this.extractJourneyNames();
    } else {
      this.dataSourceopportunities.data = this.dataforfilter;
  
      this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
        const itemDateTime = item.purchasedate.toDate();

        
        const journeyMatches = !journeyName.length || journeyName.includes(item.journeyname) || journeyName.includes(''); 
  
       return itemDateTime >= this.startOfMonth && itemDateTime <= this.endOfMonth && journeyMatches;
      });
      this.extractJourneyNames();
    }
  }
  
  // onDateRangeChange(): void {
  //   const { start, end, journeyName } = this.dateRangeForm.value;
  
  //   if (start && end) {
  //     const fromDateTime = start.getTime();
  //     const toDateTime = end.getTime();
  
  //     this.dataSourceopportunities.data = this.dataforfilter;
  
  //     this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
  //       const itemDateTime = item.converteddate.toDate().getTime();
  //       const journeyMatches = !journeyName.length || journeyName.includes(item.journeyname) || journeyName.includes(''); 
  //       return itemDateTime >= fromDateTime && itemDateTime <= toDateTime && journeyMatches;
  //     });
  
  //     this.calculateTotalPurchaseValue();
  //   }
  // }
  
  // onDateRangeChange(): void {
  //   const { start, end } = this.dateRangeForm.value;
  //   if (start && end) {
  //     const fromDateTime = start.getTime();
  //     const toDateTime = end.getTime();

  //     this.dataSourceopportunities.data = this.dataforfilter
     
  //      this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
  //       const itemDateTime = item.converteddate.toDate().getTime();
  //       return itemDateTime >= fromDateTime && itemDateTime <= toDateTime;
  //     });
  //     this.calculateTotalPurchaseValue();
  //   }
  // }
//       if ( !this.dataSourceopportunities.data.length) {
//   return 0;
// } 
// this.data = this.dataSourceopportunities.data;
// return (this.data).map(this.dataSourceopportunities.data.totalpurchasevalue || 0).reduce((acc, value) => acc + value, 0);

// calculateTotalPurchaseValue(): void {
//   this.totalPurchaseValue = this.dataSourceopportunities.data
//     .map(item => Number(item.totalpurchasevalue) || 0)
//     .reduce((acc, value) => acc + value, 0);
// }

calculateTotalPurchaseValue(): number {
  if (!this.dataSourceopportunities || !this.dataSourceopportunities.data || !this.dataSourceopportunities.data.length) {
    return 0;
  }
  return this.dataSourceopportunities.data
    .map(item => item.totalpurchasevalue || 0)
    .reduce((acc, value) => acc + value, 0);
}

// getamountSpend(): number {
//   if ( !this.tableData.length) {
//     return 0;
//   } 
//   this.data = this.dataSource.data;
//   return (this.data).map(date => this.outputTableStructure[date]?.amountSpend || 0).reduce((acc, value) => acc + value, 0);
// }

applyCurrentMonthFilter(): void {
  this.dateRangeForm.reset({
    start: null,
    end: null,
    journeyName: [] 
  });

  this.dataSourceopportunities.data = this.dataforfilter;

  this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
    const itemDate = item.purchasedate.toDate();
    return itemDate >= this.startOfMonth && itemDate <= this.endOfMonth;
  });

  if (
    !this.dateRangeForm.value.journeyName?.length &&
    !this.dateRangeForm.value.start &&
    !this.dateRangeForm.value.end
  ) {
    this.dataSourceopportunities.data = this.dataforfilter; 
    this.extractJourneyNames();
  }

  this.calculateTotalPurchaseValue();
  this.onDateRangeChange()
}

  // applyCurrentMonthFilter(): void {
  //   this.dateRangeForm.reset({
  //     start: null,
  //     end: null,
  //     journeyName: [] 
  //   });
  //   this.dataSourceopportunities.data = this.dataforfilter
  //   this.dataSourceopportunities.data = this.dataSourceopportunities.data.filter(item => {
  //     const itemDate = item.converteddate.toDate();
  //     return itemDate >= this.startOfMonth && itemDate <= this.endOfMonth;
  //   });
  //   this.calculateTotalPurchaseValue();
  // }

  exportexcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSourceopportunities.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}


 