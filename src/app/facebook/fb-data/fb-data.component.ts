// import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatDrawer } from '@angular/material/sidenav';
// import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { MatDialog } from '@angular/material/dialog';
// import { LeaddialogComponent } from '../leaddialog/leaddialog.component';
// import { switchMap, take, tap } from 'rxjs/operators';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import { Observable, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// interface FacebookData {
//   campaignSets(arg0: string, campaignSets: any): unknown;
//   campaignBudget: any;
//   campaignId: any;
//   campaignName: string;
//   campaignActive: number;
//   docDate: firebase.firestore.Timestamp;
//   adsets: AdsetType[];
//   adaccount: string;
// }

// interface AdsetType {
//   adaccount: string | null;
//   adsetBudget: any;
//   adsetName: any;
//   adName: string;
//   ads: AdType[];
// }

// interface AdType {
//   adId: string;
//   adName: string;
//   insights: InsightType[];
// }

// interface InsightType {
//   reach: string;
//   impressions: string;
//   frequency: string;
//   amountSpend: string;
//   videoPlays25: string;
//   videoPlays50: string;
//   videoPlays75: string;
//   videoPlays100: string;
//   videoPlayActions: string;
// }

// interface CampaignInfo {
//   count: number;
//   minDate: Date;
//   maxDate: Date;
//   minDocument: FacebookData;
//   maxDocument: FacebookData;
//   minSpendDocument: FacebookData | null;
//   maxSpendDocument: FacebookData | null;
//   [key: string]: any;
// }
// interface FacebookSet {
//   [x: string]: any;
//   formattedDate: string; 
//   campaignName?: string;
//   adsetName?: string;
//   adname?: string;
//   //docDate: Date;
//   campaignSets: FacebookData[];
// }

// interface Result {
//   campaignInfo: { [key: string]: CampaignInfo };
//   totalCount: number;
// }

// @Component({
//   selector: 'app-fb-data',
//   templateUrl: './fb-data.component.html',
//   styleUrls: ['./fb-data.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })

// export class FbDataComponent implements OnInit, OnDestroy{
//   private ngUnsubscribe = new Subject();
//   dataSource = new MatTableDataSource<FacebookData>();
//   data$: Observable<FacebookData[]>;
//   entries: Observable<any[]>;
//   lylregistration: Observable<any[]>;
//   adwebsiteurl: Observable<any[]>
//   displayedColumns: string[] = ['position','Adaccount', 'daterange', 'campaignname', 'campaignbudget', 'campaignobjective', 'campaignactive', 'adsetbudget', 'adsetAds'];
//   searchCampaign: string = '';
//   selectedAd: string | null = null;
//   showDetails: boolean = false;
//   clickedAd: AdType | null = null;
//   selectedDate: Date = new Date();
//   row: any = {};
//   facebookset: FacebookSet[] = [];
//   set!: FacebookSet;
//   dataHistory: any[] = [];
//   entry: any;
//   matchingSet: any;
//   groupedEntries: any[] = []; 
//   group:any;
//   selectedadaccounts: (string | null)[] = [];
//   uniqueAdAccounts: string[] = [];  
//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;
//   selectedDateRange: string = '';
//   form!: FormGroup;
//   selectedAccount: string = '';
//   adaccounts: string[] = [];
//   selectedValue: any; 
//   originalset: any[]= this.facebookset; 
//   daterangeset: any[] = [];

//   @ViewChild(MatPaginator, { static: true })
//   paginator!: MatPaginator;
//   @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

//   todayDate: Date = new Date();
//   minDocument: any;
//   maxDocument: any;
//   spendDifference: number | undefined;
//   filteredFacebookSet: { campaignSets: FacebookData[]; formattedDate: string; campaignName?: string | undefined; adsetName?: string | undefined; adname?: string | undefined; }[] | undefined;
//   FacebookSet: any;

//   constructor(private firestore: AngularFirestore, private dialog: MatDialog,private fb: FormBuilder) {
//     this.data$ = this.firestore.collection<FacebookData>('facebookadsdata').valueChanges();
//     this.entries = this.firestore.collection<any>('entries').valueChanges();
//     this.lylregistration = this.firestore.collection<any>('lylregistration').valueChanges();
//     this.adwebsiteurl = this.firestore.collection<any>('adwebsiteurl').valueChanges();
//   }

//   ngOnInit(): void {
//     this.todayDate.setHours(0, 0, 0, 0);
//     this.setupDataFetch();
//     this.form= this.fb.group({
//       daterange: new FormGroup({
//         start: new FormControl(),
//         end: new FormControl()
//       })
//     });
//     this.setupForm();
//   }

//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }

//   setupForm(): void {
//     this.form = this.fb.group({
//       daterange: new FormGroup({
//         start: new FormControl(),
//         end: new FormControl()
//       })
//     });
//   }

//   onStartDateSelected(event: MatDatepickerInputEvent<Date>): void {
//     this.selectedStartDate = event.value;
//     this.applyDateRangeFilter();
//   }

//   onEndDateSelected(event: MatDatepickerInputEvent<Date>): void {
//     this.selectedEndDate = event.value;
//     this.applyDateRangeFilter();
//   }

//   getDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = ('0' + (date.getMonth() + 1)).slice(-2);
//     const day = ('0' + date.getDate()).slice(-2);
//     return `${year}-${month}-${day}`;
//   }

//   applyDateRangeFilter(): void {
//     if (this.selectedStartDate && this.selectedEndDate) {
//       const startDate = new Date(this.selectedStartDate);
//       const endDate = new Date(this.selectedEndDate);

//       this.facebookset = this.facebookset.filter(set => {
//         const setDate = new Date(set.formattedDate);
//         const adjustedEndDate = new Date(endDate);
//         adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
//         const isInRange = setDate >= startDate && setDate <= adjustedEndDate;
//         return isInRange;
//       });
//     } else {
//       this.filteredFacebookSet = [];
//     }
//   }
 
//   applyaccountFilter() {
//     if (this.selectedValue.trim().toLowerCase() === 'all') {
//       this.facebookset = this.originalset;
//     } else {
//       this.facebookset = this.originalset.map(facebookData => {
//         return {
//           ...facebookData,
//           campaignSets: facebookData.campaignSets.filter((campaignSet: { adaccount: string; }) =>
//             campaignSet.adaccount  && campaignSet.adaccount.toLowerCase() === this.selectedValue.trim().toLowerCase()
//           )
//         };
//       }).filter(facebookData => facebookData.campaignSets.length > 0); 
//     }
//   }

//   async setupDataFetch(): Promise<void> {
//     try {
//       const data = await this.lylregistration.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();
//       const data1 = await this.entries.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();
//       const entriesData = [...data, ...data1];
//       const facebookAdsData = await this.data$.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();

//       this.processEntriesAndData(entriesData, facebookAdsData);

//     } catch (error) {
//       console.error('Error during initialization:', error);
//     }
//   }

//   processEntriesAndData(entriesData: any[], facebookAdsData: FacebookData[]): void {
//     this.groupFacebookDataByFormattedDate(facebookAdsData);
//     this.dataSource.paginator = this.paginator;

//     entriesData.forEach((entry: any) => {
//       this.processEntry(entry);
//     });

//     this.filterDataByDate();

//     this.groupedEntries.sort((a, b) => {
//       const dateA = new Date(a[0]?.matchingSet.formattedDate).getTime();
//       const dateB = new Date(b[0]?.matchingSet.formattedDate).getTime();
//       return dateA - dateB;
//     });

//     this.checkAndAddNewEntry(entriesData);

//     // Add unmatched sets to groupedEntries
//     this.addUnmatchedSets(facebookAdsData);

//     console.log('groupedEntries:', this.groupedEntries);
//   }

//   groupFacebookDataByFormattedDate(facebookAdsData: FacebookData[]): void {
//     facebookAdsData.forEach((data: FacebookData) => {
//       const formattedDate = this.getDate(data.docDate.toDate());
//       let facebookSet = this.facebookset.find(set => set.formattedDate === formattedDate);

//       if (!facebookSet) {
//         facebookSet = { formattedDate: formattedDate, campaignSets: [] };
//         this.facebookset.push(facebookSet);
//       }

//       facebookSet.campaignSets.push(data);

//       if (data.adsets) {
//         data.adsets.forEach((adset: AdsetType) => {
//           this.addUniqueAdAccount(adset.adaccount);
//         });
//       }
//     });
//   }

//   addUniqueAdAccount(adaccount: string | null): void {
//     if (adaccount && !this.uniqueAdAccounts.includes(adaccount)) {
//       this.uniqueAdAccounts.push(adaccount);
//     }
//   }

//   processEntry(entry: any): void {
//     const matchingSet = this.facebookset.find(set => set.formattedDate === entry.entrydate);

//     if (matchingSet) {
//       this.selectedAd = entry.adname;
//       this.showDetails = true;

//       const group = this.groupedEntries.find(g => g[0]?.matchingSet?.formattedDate === matchingSet.formattedDate);

//       if (group) {
//         group.push({ entry, matchingSet });
//       } else {
//         this.groupedEntries.push([{ entry, matchingSet }]);
//       }

//       this.selectedadaccounts.push(entry.adaccount);
//     } else {
//       console.log(`No matching set found for entry:`, entry);
//     }
//   }

//   filterDataByDate(): void {
//     this.dataHistory = this.groupedEntries.filter(group => {
//       return group.some((entry: { entry: { entrydate: string; }; }) => entry.entry.entrydate !== '');
//     });
//   }

//   checkAndAddNewEntry(entriesData: any[]): void {
//     const newEntry = this.checkNewEntry(entriesData);
//     if (newEntry) {
//       this.groupedEntries.push(newEntry);
//     }
//   }

//   checkNewEntry(entriesData: any[]): any {
//     return this.groupedEntries.find(group =>
//       !entriesData.some(entry => entry.entrydate === group[0]?.matchingSet?.formattedDate)
//     );
//   }

//   addUnmatchedSets(facebookAdsData: FacebookData[]): void {
//     const matchedDates = this.groupedEntries.map(group => group[0].matchingSet.formattedDate);

//     this.facebookset.forEach(facebookSet => {
//       if (!matchedDates.includes(facebookSet.formattedDate)) {
//         this.groupedEntries.push([{ entry: null, matchingSet: facebookSet }]);
//       }
//     });
//   }

//   openDialog(adset: any, row: any): void {
//     const dialogRef = this.dialog.open(LeaddialogComponent, {
//       width: '400px',
//       data: { adset, row }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // Handle the result if needed
//       }
//     });
//   }

//   onRowClick(row: any): void {
//     this.row = row;
//   }

//   getAdAccount(adset: AdsetType): string | null {
//     return adset?.adaccount ?? null;
//   }

//   getAdsets(adsets: AdsetType[]): AdsetType[] {
//     return adsets.filter(adset => {
//       const adaccount = this.getAdAccount(adset);
//       return adaccount && this.selectedadaccounts.includes(adaccount);
//     });
//   }

//   getFacebookSets(): FacebookSet[] {
//     return this.facebookset;
//   }

//   getUniqueAdAccounts(): string[] {
//     return this.uniqueAdAccounts;
//   }
// }

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { LeaddialogComponent } from '../leaddialog/leaddialog.component';
import { switchMap, take, tap } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface FacebookData {
  campaignSets(arg0: string, campaignSets: any): unknown;
  campaignBudget: any;
  campaignId: any;
  campaignName: string;
  campaignActive: number;
  docDate: firebase.firestore.Timestamp;
  adsets: AdsetType[];
  adaccount: string;
}

interface AdsetType {
  adaccount: string | null;
  adsetBudget: any;
  adsetName: any;
  adName: string;
  ads: AdType[];
}

interface AdType {
  adId: string;
  adName: string;
  insights: InsightType[];
}

interface InsightType {
  reach: string;
  impressions: string;
  frequency: string;
  amountSpend: string;
  videoPlays25: string;
  videoPlays50: string;
  videoPlays75: string;
  videoPlays100: string;
  videoPlayActions: string;
}

interface CampaignInfo {
  count: number;
  minDate: Date;
  maxDate: Date;
  minDocument: FacebookData;
  maxDocument: FacebookData;
  minSpendDocument: FacebookData | null;
  maxSpendDocument: FacebookData | null;
  [key: string]: any;
}
interface FacebookSet {
  [x: string]: any;
  formattedDate: string; 
  campaignName?: string;
  adsetName?: string;
  adname?: string;
  //docDate: Date;
  campaignSets: FacebookData[];
}

interface Result {
  campaignInfo: { [key: string]: CampaignInfo };
  totalCount: number;
}

@Component({
  selector: 'app-fb-data',
  templateUrl: './fb-data.component.html',
  styleUrls: ['./fb-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FbDataComponent implements OnInit, OnDestroy{
  private ngUnsubscribe = new Subject();
  dataSource = new MatTableDataSource<FacebookData>();
  data$: Observable<FacebookData[]>;
  entries: Observable<any[]>;
  lylregistration: Observable<any[]>;
  adwebsiteurl: Observable<any[]>
  displayedColumns: string[] = ['position','Adaccount', 'daterange', 'campaignname', 'campaignbudget', 'campaignobjective', 'campaignactive', 'adsetbudget', 'adsetAds'];
  searchCampaign: string = '';
  selectedAd: string | null = null;
  showDetails: boolean = false;
  clickedAd: AdType | null = null;
  selectedDate: Date = new Date();
  row: any = {};
  facebookset: FacebookSet[] = [];
  set!: FacebookSet;
  dataHistory: any[] = [];
  entry: any;
  matchingSet: any;
  groupedEntries: any[] = []; 
  group:any;
  selectedadaccounts: (string | null)[] = [];
  uniqueAdAccounts: string[] = [];  
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedDateRange: string = '';
  form!: FormGroup;
  selectedAccount: string = '';
  adaccounts: string[] = [];
  selectedValue: any; 
  originalset: any[]= this.facebookset; 
  daterangeset: any[] = [];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

  todayDate: Date = new Date();
  minDocument: any;
  maxDocument: any;
  spendDifference: number | undefined;
  filteredFacebookSet: { campaignSets: FacebookData[]; formattedDate: string; campaignName?: string | undefined; adsetName?: string | undefined; adname?: string | undefined; }[] | undefined;
  FacebookSet: any;

  constructor(private firestore: AngularFirestore, private dialog: MatDialog,private fb: FormBuilder) {
    this.data$ = this.firestore.collection<FacebookData>('facebookadsdata').valueChanges();
    this.entries = this.firestore.collection<any>('entries').valueChanges();
    this.lylregistration = this.firestore.collection<any>('lylregistration').valueChanges();
    this.adwebsiteurl = this.firestore.collection<any>('adwebsiteurl').valueChanges();
  }

  ngOnInit(): void {
    this.todayDate.setHours(0, 0, 0, 0);
    this.setupDataFetch();
    // this.selectedadaccounts = new Array(this.facebookset.length).fill(null);
    // this.uniqueAdAccounts = this.getUniqueAdAccounts();
    // console.log('ad',this.uniqueAdAccounts);
    this.form= this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
    this.setupForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setupForm(): void {
    this.form = this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
  }

  onStartDateSelected(event: MatDatepickerInputEvent<Date>): void {
    this.selectedStartDate = event.value;
    this.applyDateRangeFilter();
  }

  onEndDateSelected(event: MatDatepickerInputEvent<Date>): void {
    this.selectedEndDate = event.value;
    this.applyDateRangeFilter();
  }

  getDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  applyDateRangeFilter(): void {
    console.log('Start Date:', this.selectedStartDate);
    console.log('End Date:', this.selectedEndDate);
  
    if (this.selectedStartDate && this.selectedEndDate) {
        const startDate = new Date(this.selectedStartDate);
        const endDate = new Date(this.selectedEndDate);
        //console.log('Formatted Start Date:', startDate);
        //console.log('Formatted End Date:', endDate);
  
        this.facebookset = this.facebookset.filter(set => {
            const setDate = new Date(set.formattedDate);
            //console.log('Event Date:', setDate);
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
            const isInRange = setDate >= startDate && setDate <= adjustedEndDate;
            return isInRange;
        });
    } else {
        this.filteredFacebookSet = [];
    }
}
 
applyaccountFilter() {

  if (this.selectedValue.trim().toLowerCase() === 'all') {
    this.facebookset = this.originalset;
  }

  else {
    this.facebookset = this.originalset.map(facebookData => {
      return {
        ...facebookData,
        campaignSets: facebookData.campaignSets.filter((campaignSet: { adaccount: string; }) =>
          campaignSet.adaccount  && campaignSet.adaccount.toLowerCase() === this.selectedValue.trim().toLowerCase()
        )
      };
    }).filter(facebookData => facebookData.campaignSets.length > 0); 
  }
}

  async setupDataFetch(): Promise<void> {
    try {
      const data =await this.lylregistration.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise()
      const data1 =await this.entries.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise() ;
      const entriesData = [...data, ...data1];
      const facebookAdsData = await this.data$.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();
      //console.log('data',entriesData)

      this.processEntriesAndData(entriesData, facebookAdsData);

    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  processEntriesAndData(entriesData: any[], facebookAdsData: FacebookData[]): void {
    this.groupFacebookDataByFormattedDate(facebookAdsData);
    console.log('Facebook Set:', this.facebookset);
    this.dataSource.paginator = this.paginator;

    entriesData.forEach((entry: any) => {
      this.processEntry(entry);
    });

    this.filterDataByDate();

    this.groupedEntries.sort((a, b) => {
      const dateA = new Date(a[0]?.matchingSet.formattedDate).getTime();
      const dateB = new Date(b[0]?.matchingSet.formattedDate).getTime();
      return dateA - dateB;
    });

    this.checkAndAddNewEntry(entriesData);
    this.addUnmatchedSets(facebookAdsData);
  }
  // processEntry(entry: any): void {
  //   if ((entry.createddate) && ( typeof entry.createddate.seconds === 'number') && (typeof entry.createddate.nanoseconds === 'number')) {
  //     const entryDate = new Date(entry.createddate.seconds * 1000 + entry.createddate.nanoseconds / 1e6);
  //     const formattedEntryDate = entryDate.toISOString().split('T')[0];

  //     const matchingSet = this.findMatchingSet(entry, formattedEntryDate);

  //     if (matchingSet) {
  //       this.addEntryToMatchingSet(matchingSet, entry, formattedEntryDate);
  //     }
  //   } else {
  //     console.error('Entry does not have a valid createddate:', entry);
  //   }
  // }

  processEntry(entry: any): void {
    if ((entry.createddate && typeof entry.createddate.seconds === 'number' && typeof entry.createddate.nanoseconds === 'number') ||
        (entry.entrydata && typeof entry.entrydata.seconds === 'number' && typeof entry.entrydata.nanoseconds === 'number')) {
  
      const entryDate = entry.createddate ? new Date(entry.createddate.seconds * 1000 + entry.createddate.nanoseconds / 1e6) :
                                           new Date(entry.entrydata.seconds * 1000 + entry.entrydata.nanoseconds / 1e6);
  
      const formattedEntryDate = entryDate.toISOString().split('T')[0];
  
      const matchingSet = this.findMatchingSet(entry, formattedEntryDate);
  
      if (matchingSet) {
        this.addEntryToMatchingSet(matchingSet, entry, formattedEntryDate);
      }
    } else {
      console.error('Entry does not have a valid createddate or entrydata:', entry);
    }
  }
  
  findMatchingSet(entry: any, formattedEntryDate: string): FacebookSet | undefined {
    return this.facebookset.find((set, index) => {
      const startDate = this.getFormattedStartDate(index);
      const endDate = set.formattedDate;

      const dateCondition = formattedEntryDate >= startDate && formattedEntryDate <= endDate;
      const campaignCondition = this.checkCampaignCondition(entry, set);

      return dateCondition && campaignCondition;
    });
  }

  checkCampaignCondition(entry: any, set: FacebookSet): boolean {
    if (entry.utmmedium !== undefined && entry.utmmedium !== null && entry.utmmedium !== "") {
      return set.campaignSets.some(campaignSet =>
        campaignSet.adsets.some(adset =>
          adset.ads.some(ad =>
            campaignSet.campaignName === entry.utmmedium
          )
        )
      );
    } else if (entry.url) {
      const utmMediumFromUrl = this.extractUtmMediumFromUrl(entry.url);
      const utmCampaignFromUrl = this.extractUtmCampaignFromUrl(entry.url);
      const formattedUtmMediumFromUrl = utmMediumFromUrl.replace(/\s/g, '');
      const formattedUtmCampaignFromUrl = utmCampaignFromUrl ? utmCampaignFromUrl.replace(/\+/g, '') : '';
  
      return set.campaignSets.some(campaignSet =>
        campaignSet.adsets.some(adset =>
          adset.ads.some(ad => {
            const formattedCampaignName = campaignSet.campaignName.replace(/\s/g, '');
            return formattedCampaignName === formattedUtmMediumFromUrl || formattedCampaignName === formattedUtmCampaignFromUrl;
          })
        )
      );
    }
  
    return false;
  }
  
  extractUtmCampaignFromUrl(url: string): string | null {
    const matches = url.match(/[?&]utm_campaign=([^&]+)/);
    return matches ? matches[1] : '';
  }
  extractUtmMediumFromUrl(url: string): string {
    const matches = url.match(/[?&]utm_medium=([^&]+)/);
    return matches ? matches[1] : '';
  }
  
 addEntryToMatchingSet(matchingSet: FacebookSet, entry: any, formattedEntryDate: string): void {
    let matchingSetGroup = this.groupedEntries.find(group => this.areMatchingSetsEqual(group[0]?.matchingSet, matchingSet));

    if (!matchingSetGroup) {
      matchingSetGroup = [{ matchingSet, entries: [] }];
      this.groupedEntries.push(matchingSetGroup);
      console.log('entry',this.groupedEntries);
    }

    matchingSetGroup[0].entries.push({
      leadname: entry.name,
      email: entry.email,
      campaignname: (entry.utmmedium || (this.extractUtmMediumFromUrl(entry.url) || this.extractUtmCampaignFromUrl(entry.url)) ),
      url:entry.url,
      adsetname: entry.utmcampaign,
      adname: entry.utmcontent,
      createddate: formattedEntryDate,
    });
  }

  addUnmatchedSets(facebookAdsData: FacebookData[]): void {
    const matchedDates = this.groupedEntries.map(group => group[0].matchingSet.formattedDate);
  
    this.facebookset.forEach(facebookSet => {
      if (!matchedDates.includes(facebookSet.formattedDate)) {
        this.groupedEntries.push([{ matchingSet: facebookSet, entries: [] }]);
      }
    });
  }

  checkAndAddNewEntry(entriesData: any[]): void {
    const latestEntryDate = entriesData.reduce((latestDate, entry) => {
      if ((entry.createddate || entry.entrydata) &&
          (entry.createddate && typeof entry.createddate.seconds === 'number' && typeof entry.createddate.nanoseconds === 'number') ||
          (entry.entrydata && typeof entry.entrydata.seconds === 'number' && typeof entry.entrydata.nanoseconds === 'number')) {
  
        const entryDate = entry.createddate ? new Date(entry.createddate.seconds * 1000 + entry.createddate.nanoseconds / 1e6) :
                                               new Date(entry.entrydata.seconds * 1000 + entry.entrydata.nanoseconds / 1e6);
        return entryDate > latestDate ? entryDate : latestDate;
      }
      return latestDate;
    }, this.todayDate);
  
    const latestFormattedDate = this.getFormattedDate(new firebase.firestore.Timestamp(latestEntryDate.getTime() / 1000, 0));
  
    if (!this.facebookset.some(set => set.formattedDate === latestFormattedDate)) {
      this.facebookset.push({
        formattedDate: latestFormattedDate,
        campaignSets: [] 
      });
    }
  }

  //addUnmatchedSets(facebookAdsData: FacebookData[]): void {
    //     const matchedDates = this.groupedEntries.map(group => group[0].matchingSet.formattedDate);
    
    //     this.facebookset.forEach(facebookSet => {
    //       if (!matchedDates.includes(facebookSet.formattedDate)) {
    //         this.groupedEntries.push([{ entry: null, matchingSet: facebookSet }]);
    //       }
    //     });
    //   }
  
  openLeadDialog(index: number): void {
    if (this.groupedEntries.length > index) {
      const selectedSetEntries = this.groupedEntries[index];
  
      const dialogRef = this.dialog.open(LeaddialogComponent, {
        width: '400px',
        data: { entries: selectedSetEntries },
      });
  
      dialogRef.afterClosed().subscribe((data: any) => {
        //console.log('Dialog closed with result:', data);
      });
    }
  }

  areMatchingSetsEqual(set1: any, set2: any): boolean {
    return JSON.stringify(set1) === JSON.stringify(set2);
  }

  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value ? new Date(event.value.getFullYear(), event.value.getMonth(), event.value.getDate()) : new Date();
    this.filterDataByDate();
  }  

  filterDataByDate(): void {
    this.data$.subscribe(data => {
      const filteredData = data.filter(item =>
        item.campaignActive !== 0 &&  this.compareDates(item.docDate, this.selectedDate)
      );
      this.dataSource.data = filteredData;
    });
  }

//   groupFacebookDataByFormattedDate(data: FacebookData[]): void {
//     data.forEach(item => {
//       if (item.docDate && item.campaignActive !== 0) {
//         const formattedDate = this.getFormattedDate(item.docDate);
  
//         const existingSetIndex = this.facebookset.findIndex(set => set.formattedDate === formattedDate);
  
//         if (existingSetIndex !== -1) {
//           const matchingItemIndex = this.facebookset[existingSetIndex].campaignSets.findIndex(existingItem =>
//             this.haveSameCampaignId(existingItem, item) && this.haveSameProperties(existingItem, item)
//           );
  
//           if (matchingItemIndex === -1) {
//             this.facebookset[existingSetIndex].campaignSets.push(item);
//           }
//         } else {
//           this.facebookset.push({
//             formattedDate: formattedDate,
//             campaignSets: [item]
//           });
//         }
//       }
//     });
  
//     const changes: FacebookData[] = [];
  
//     for (let i = 0; i < this.facebookset.length - 1; i++) {
//       const currentSet = this.facebookset[i];
  
//       for (let j = i + 1; j < this.facebookset.length; j++) {
//         const nextSet = this.facebookset[j];
  
//         let setsMatch = true;
//         for (let k = 0; k < currentSet.campaignSets.length; k++) {
//           const currentCampaignSet = currentSet.campaignSets[k];
//           let foundMatchingSet = false;
  
//           for (let l = 0; l < nextSet.campaignSets.length; l++) {
//             const nextCampaignSet = nextSet.campaignSets[l];
  
//             if (this.haveSameCampaignId(currentCampaignSet, nextCampaignSet) && this.haveSameCampaignDetails(currentCampaignSet, nextCampaignSet)) {
//               foundMatchingSet = true;
//               break;
//             } else {
//               if (!nextCampaignSet.adaccount) {
//                 nextCampaignSet.adaccount = "Magnetic_Marketing";
//               }

//               if (!this.haveSameCampaignDetails(currentCampaignSet, nextCampaignSet)) {
//                 changes.push(nextCampaignSet);
//               }
//             }
//           }
  
//           if (!foundMatchingSet) {
//             setsMatch = false;
//             break;
//           }
//         }
  
//         if (setsMatch) {
//           const indexToRemove = i < j ? i : j;
//           this.removeLowerIndexSet(indexToRemove);
//           i--;
//           break;
//         }
//       }
//     }
  
//     console.log('Changes:', changes);
//   }

//   haveSameProperties(item1: FacebookData, item2: FacebookData): boolean {
//   return (
//     item1.campaignName === item2.campaignName &&
//     this.compareArrays(item1.adsets.map(adset => adset.adsetName), item2.adsets.map(adset => adset.adsetName)) &&
//     this.compareArrays(item1.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName)), item2.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName))) &&
//     this.compareArrays(item1.adsets.map(adset => adset.adsetBudget), item2.adsets.map(adset => adset.adsetBudget)) &&
//     item1.campaignBudget === item2.campaignBudget
//   );
// }

//   haveSameCampaignDetails(item1: FacebookData, item2: FacebookData): boolean {
//     return (
//       item1.campaignName === item2.campaignName &&
//       this.compareArrays(item1.adsets.map(adset => adset.adsetName), item2.adsets.map(adset => adset.adsetName)) &&
//       this.compareArrays(item1.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName)), item2.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName))) &&
//       this.compareArrays(item1.adsets.map(adset => adset.adsetBudget), item2.adsets.map(adset => adset.adsetBudget)) &&
//       item1.campaignBudget === item2.campaignBudget
//     );
//   }
  
//   compareArrays(arr1: any[], arr2: any[]): boolean {
//     return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
//   }
  
//   removeLowerIndexSet(index: number): void {
//     this.facebookset.splice(index, 1);
//   }
  

  groupFacebookDataByFormattedDate(data: FacebookData[]): void {
    data.forEach(item => {
      if (item.docDate && item.campaignActive !== 0) {
        const formattedDate = this.getFormattedDate(item.docDate);
  
        const existingSetIndex = this.facebookset.findIndex(set => set.formattedDate === formattedDate);
  
        if (existingSetIndex !== -1) {
          const matchingItemIndex = this.facebookset[existingSetIndex].campaignSets.findIndex(existingItem =>
            this.haveSameCampaignId(existingItem, item) && this.haveSameProperties(existingItem, item)
          );
  
          if (matchingItemIndex === -1) {
            this.facebookset[existingSetIndex].campaignSets.push(item);
          }
        } else {
          this.facebookset.push({
            formattedDate: formattedDate,
            campaignSets: [item]
          });
        }
      }
    });
  
    for (let i = 0; i < this.facebookset.length - 1; i++) {
      const currentSet = this.facebookset[i];
  
      for (let j = i + 1; j < this.facebookset.length; j++) {
        const nextSet = this.facebookset[j];
  
        let setsMatch = true;
        for (let k = 0; k < currentSet.campaignSets.length; k++) {
          const currentCampaignSet = currentSet.campaignSets[k];
          let foundMatchingSet = false;
  
          for (let l = 0; l < nextSet.campaignSets.length; l++) {
            const nextCampaignSet = nextSet.campaignSets[l];
  
            if (this.haveSameCampaignId(currentCampaignSet, nextCampaignSet) && this.haveSameProperties(currentCampaignSet, nextCampaignSet)) {
              foundMatchingSet = true;
              break;
            }else {
              if (!nextCampaignSet.adaccount) {
                nextCampaignSet.adaccount = "Magnetic_Marketing";
              }
              //console.log("Sets not same:previous set", currentCampaignSet,"current set", nextCampaignSet); 
            }
          }
  
          if (!foundMatchingSet) {
            
            setsMatch = false;
            break;
          }
        }
  
        if (setsMatch) {
          const indexToRemove = i < j ? i : j;
          this.removeLowerIndexSet(indexToRemove);
          i--; 
          break; 
        }
      }
    }
  }
  
  
haveSameCampaignId(set1: FacebookData, set2: FacebookData): boolean {
  return set1.campaignId === set2.campaignId;
}

haveSameProperties(item1: FacebookData, item2: FacebookData): boolean {
  return (
    item1.campaignName === item2.campaignName &&
    this.compareArrays(item1.adsets.map(adset => adset.adsetName), item2.adsets.map(adset => adset.adsetName)) &&
    this.compareArrays(item1.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName)), item2.adsets.map((adset: { ads: any[]; }) => adset.ads.map((ad: { adName: any; }) => ad.adName))) &&
    this.compareArrays(item1.adsets.map(adset => adset.adsetBudget), item2.adsets.map(adset => adset.adsetBudget)) &&
    item1.campaignBudget === item2.campaignBudget
  );
}

  compareArrays(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  removeLowerIndexSet(index: number): void {
    const currentSet = this.facebookset[index];
    const nextSet = this.facebookset[index + 1];

    this.facebookset.splice(index, 1);
}

  getFormattedStartDate(index: number): string {
    if (index > 0) {
      const previousSetEndDate = this.facebookset[index - 1].campaignSets[0].docDate;
      const endDateAsDate = previousSetEndDate.toDate();
      const startDate = new Date(endDateAsDate.getTime() + 24 * 60 * 60 * 1000);
  
      return this.getFormattedDate(new firebase.firestore.Timestamp(startDate.getTime() / 1000, 0));
    }
    return '2024-02-01'; 
  }

  toggleAdDetails(ad: AdType): void {
    if (this.clickedAd === ad) {
      this.showDetails = !this.showDetails;
      this.clickedAd = this.showDetails ? ad : null;
    } else {
      this.showDetails = true;
      this.clickedAd = ad;
    }
  }

  getPosition(index: number): number {
    return index + 1;
  }

  getFormattedDate(timestamp: firebase.firestore.Timestamp): string {
    const date = new Date(timestamp.toMillis());
    return date.toISOString().split('T')[0];
  }

  getPageSizeOptions(data: any[]): number[] {
    return [3, 10, 20];
  }

  compareDates(timestamp: firebase.firestore.Timestamp, compareDate: Date): boolean {
    if (!timestamp) {
      return false;
    }
    const date = new Date(timestamp.toMillis());
    const timestampDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const compareDateTime = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());

    return timestampDate.getTime() === compareDateTime.getTime();
  }

 applyFilterset() {
    this.dataSource.filter = this.searchCampaign.trim().toLowerCase();
  }

}

// import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { Observable, Subject } from 'rxjs';
// import { combineLatest, takeUntil } from 'rxjs/operators';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// interface FacebookData {
//   campaignSets: any;
//   campaignBudget: any;
//   campaignId: any;
//   campaignName: string;
//   campaignActive: number;
//   docDate: firebase.firestore.Timestamp;
//   adsets: AdsetType[];
//   adaccount: string;
// }

// interface AdsetType {
//   adaccount: string | null;
//   adsetBudget: any;
//   adsetName: any;
//   adName: string;
//   ads: AdType[];
// }

// interface AdType {
//   adId: string;
//   adName: string;
//   insights: InsightType[];
// }

// interface InsightType {
//   reach: string;
//   impressions: string;
//   frequency: string;
//   amountSpend: string;
//   videoPlays25: string;
//   videoPlays50: string;
//   videoPlays75: string;
//   videoPlays100: string;
//   videoPlayActions: string;
// }

// interface FacebookSet {
//   formattedDate: string;
//   campaignSets: FacebookData[];
// }

// @Component({
//   selector: 'app-fb-data',
//   templateUrl: './fb-data.component.html',
//   styleUrls: ['./fb-data.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class FbDataComponent implements OnInit, OnDestroy {
//   private ngUnsubscribe = new Subject<void>();
//   dataSource = new MatTableDataSource<FacebookData>();
//   facebookset: FacebookSet[] = [];
//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;
//   form: FormGroup;

//   @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

//   constructor(private firestore: AngularFirestore, private fb: FormBuilder) {
//     this.form = this.fb.group({
//       daterange: this.fb.group({
//         start: new FormControl(),
//         end: new FormControl(),
//       }),
//     });
//   }

//   ngOnInit(): void {
//     this.fetchData();
//     this.setupForm();
//   }

//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }

//   private setupForm(): void {
//     const dateRange = this.form.get('daterange');
//     dateRange?.get('start')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((date: Date) => {
//       this.selectedStartDate = date;
//       this.applyDateRangeFilter();
//     });

//     dateRange?.get('end')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((date: Date) => {
//       this.selectedEndDate = date;
//       this.applyDateRangeFilter();
//     });
//   }

//   private fetchData(): void {
//     // Fetching all required data at once
//     const facebookAdsData$ = this.firestore.collection<FacebookData>('facebookadsdata').valueChanges();
//     const entries$ = this.firestore.collection<any>('entries').valueChanges();
//     const lylregistration$ = this.firestore.collection<any>('lylregistration').valueChanges();

//     // Merging all data streams
//     combineLatest([facebookAdsData$, entries$, lylregistration$])
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(([facebookAdsData, entriesData, lylregistrationData]) => {
//         this.processData(facebookAdsData);
//         // Further processing of entriesData and lylregistrationData if needed...
//       });
//   }

//   private processData(facebookAdsData: FacebookData[]): void {
//     this.facebookset = this.groupFacebookDataByFormattedDate(facebookAdsData);
//     this.dataSource.data = this.facebookset;
//     this.dataSource.paginator = this.paginator;
//   }

//   private groupFacebookDataByFormattedDate(data: FacebookData[]): FacebookSet[] {
//     const groupedData: FacebookSet[] = [];

//     data.forEach(item => {
//       if (item.docDate && item.campaignActive !== 0) {
//         const formattedDate = this.getFormattedDate(item.docDate);
//         const existingSet = groupedData.find(set => set.formattedDate === formattedDate);

//         if (existingSet) {
//           if (!existingSet.campaignSets.some(existingItem => this.haveSameCampaignId(existingItem, item) && this.haveSameProperties(existingItem, item))) {
//             existingSet.campaignSets.push(item);
//           }
//         } else {
//           groupedData.push({ formattedDate, campaignSets: [item] });
//         }
//       }
//     });

//     // Optimize removal of duplicate sets
//     this.removeDuplicateSets(groupedData);
//     return groupedData;
//   }

//   private removeDuplicateSets(groupedData: FacebookSet[]): void {
//     for (let i = 0; i < groupedData.length; i++) {
//       const currentSet = groupedData[i];

//       for (let j = i + 1; j < groupedData.length; j++) {
//         const nextSet = groupedData[j];
        
//         if (this.haveSameSets(currentSet, nextSet)) {
//           groupedData.splice(j, 1);
//           j--; // Adjust index after removal
//         }
//       }
//     }
//   }

//   private haveSameSets(set1: FacebookSet, set2: FacebookSet): boolean {
//     return set1.campaignSets.every(currentCampaignSet => 
//       set2.campaignSets.some(nextCampaignSet => 
//         this.haveSameCampaignId(currentCampaignSet, nextCampaignSet) &&
//         this.haveSameProperties(currentCampaignSet, nextCampaignSet)
//       )
//     );
//   }

//   private haveSameCampaignId(set1: FacebookData, set2: FacebookData): boolean {
//     return set1.campaignId === set2.campaignId;
//   }

//   private haveSameProperties(item1: FacebookData, item2: FacebookData): boolean {
//     return (
//       item1.campaignName === item2.campaignName &&
//       this.compareArrays(item1.adsets.map(adset => adset.adsetName), item2.adsets.map(adset => adset.adsetName)) &&
//       this.compareArrays(
//         item1.adsets.flatMap(adset => adset.ads.map(ad => ad.adName)), 
//         item2.adsets.flatMap(adset => adset.ads.map(ad => ad.adName))
//       ) &&
//       this.compareArrays(item1.adsets.map(adset => adset.adsetBudget), item2.adsets.map(adset => adset.adsetBudget)) &&
//       item1.campaignBudget === item2.campaignBudget
//     );
//   }

//   private compareArrays(arr1: any[], arr2: any[]): boolean {
//     return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
//   }

//   private applyDateRangeFilter(): void {
//     const startDate = this.selectedStartDate?.getTime() || 0;
//     const endDate = this.selectedEndDate ? this.selectedEndDate.getTime() + 86400000 : Date.now(); // +1 day for inclusive end

//     this.dataSource.filter = this.facebookset.filter(set => {
//       const setDate = new Date(set.formattedDate).getTime();
//       return setDate >= startDate && setDate <= endDate;
//     });
//   }

//   private getFormattedDate(timestamp: firebase.firestore.Timestamp): string {
//     return new Date(timestamp.seconds * 1000).toLocaleDateString(); // Example formatting
//   }
// }
