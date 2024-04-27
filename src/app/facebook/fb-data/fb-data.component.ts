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
      const entriesData = await this.entries.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();
      const facebookAdsData = await this.data$.pipe(takeUntil(this.ngUnsubscribe), take(1)).toPromise();

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
  }

  processEntry(entry: any): void {
    if (entry.createddate && typeof entry.createddate.seconds === 'number' && typeof entry.createddate.nanoseconds === 'number') {
      const entryDate = new Date(entry.createddate.seconds * 1000 + entry.createddate.nanoseconds / 1e6);
      const formattedEntryDate = entryDate.toISOString().split('T')[0];

      const matchingSet = this.findMatchingSet(entry, formattedEntryDate);

      if (matchingSet) {
        this.addEntryToMatchingSet(matchingSet, entry, formattedEntryDate);
      }
    } else {
      console.error('Entry does not have a valid createddate:', entry);
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
      const formattedUtmMediumFromUrl = utmMediumFromUrl.replace(/\s/g, '');
      return set.campaignSets.some(campaignSet =>
        campaignSet.adsets.some(adset =>
          adset.ads.some(ad => {
            const formattedCampaignName = campaignSet.campaignName.replace(/\s/g, '');
            return formattedCampaignName === formattedUtmMediumFromUrl;
          })
        )
      );
    }

    return false;
  }
 addEntryToMatchingSet(matchingSet: FacebookSet, entry: any, formattedEntryDate: string): void {
    let matchingSetGroup = this.groupedEntries.find(group => this.areMatchingSetsEqual(group[0]?.matchingSet, matchingSet));

    if (!matchingSetGroup) {
      matchingSetGroup = [{ matchingSet, entries: [] }];
      this.groupedEntries.push(matchingSetGroup);
      //console.log('entry',this.groupedEntries);
    }

    matchingSetGroup[0].entries.push({
      leadname: entry.name,
      email: entry.email,
      campaignname: entry.utmmedium,
      url:entry.url,
      adsetname: entry.utmcampaign,
      adname: entry.utmcontent,
      createddate: formattedEntryDate,
    });
  }

 checkAndAddNewEntry(entriesData: any[]): void {
    const latestEntryDate = entriesData.reduce((latestDate, entry) => {
      if (entry.createddate && typeof entry.createddate.seconds === 'number' && typeof entry.createddate.nanoseconds === 'number') {
        const entryDate = new Date(entry.createddate.seconds * 1000 + entry.createddate.nanoseconds / 1e6);
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

  extractUtmMediumFromUrl(url: string): string {
    const matches = url.match(/[?&]utm_medium=([^&]+)/);
    return matches ? matches[1] : '';
  }

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