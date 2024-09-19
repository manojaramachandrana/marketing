import { Component, OnInit,ViewChild  } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ConversionDialogComponent } from '../conversion-dialog/conversion-dialog.component';
import { MatDialog } from '@angular/material/dialog';


interface CampaignData {
  month: string;
  leads: number;
  sales: number;
  conversion30: number;
  conversion60: number;
  conversion90: number;
  conversion120: number;
  conversion240: number;
  conversion360: number;
  conversion30conv: any[];
  conversion60conv: any[];
  conversion90conv: any[];
  conversion120conv: any[];
  conversion240conv: any[];
  conversion360conv: any[];
}

@Component({
  selector: 'app-salesconv',
  templateUrl: './salesconv.component.html',
  styleUrls: ['./salesconv.component.css']
})
export class SalesconvComponent implements OnInit {
  dataSource = new MatTableDataSource<CampaignData>();
  displayedColumns: string[] = ['month', 'leads', 'sales', 'conversion30', 'conversion60', 'conversion90','conversion120', 'conversion240', 'conversion360',];
  outputTableStructure:any = {};
  tableData: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private monthMap: { [key: string]: number } = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11
  };

  constructor(private firestore: AngularFirestore,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAndProcessSalesData();
  }



  async fetchAndProcessSalesData(): Promise<void> {
    try {
      this.outputTableStructure = {};
      this.tableData = [];

      await this.processLeadsCollection();
      await Promise.all([
        this.processCollection('entries', 'createddate'),
        this.processCollection('lylregistration', 'entrydata')
      ]);

      await this.calculateConversions();
      this.sortOutputTableStructure();

      this.dataSource.data = Object.values(this.outputTableStructure);

      console.log('outputTableStructure:', this.outputTableStructure);
      console.log('tableData:', this.tableData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  }

  async processLeadsCollection(): Promise<void> {
    try {
      const snap = await this.firestore.collection('leads').get().toPromise();
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        // const date = 
        // this.convertToDate(element['purchasedate'])
        
        const date = this.convertToDate(element['converteddate']);

        if (date) {
          const monthYear = this.formatDateToMonthYear(date);
          if (!this.outputTableStructure[monthYear]) {
            this.outputTableStructure[monthYear] = {
              month: monthYear,
              sales: 0,
              leads: 0,
              conversion30: 0,
              conversion60: 0,
              conversion90: 0,
              conversion120: 0,
              conversion240: 0,
              conversion360: 0,
              conversion30conv: [],
              conversion60conv: [],
              conversion90conv: [],
              conversion120conv: [],
              conversion240conv: [],
              conversion360conv: []
            };
          }
          this.outputTableStructure[monthYear]['sales'] =  this.outputTableStructure[monthYear]['sales'] + 1;
          if (!this.tableData.includes(monthYear)) {
            this.tableData.push(monthYear);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching leads data:', error);
    }
  }

  async processCollection(collectionName: string, dateField: string): Promise<void> {
    try {
      const snap = await this.firestore.collection(collectionName).get().toPromise();
      const entriesMap = new Map<string, number>();

      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        const date = this.convertToDate(element[dateField]);

        if (date) {
          const monthYear = this.formatDateToMonthYear(date);
          if (!entriesMap.has(monthYear)) {
            entriesMap.set(monthYear, 0);
          }
          entriesMap.set(monthYear, (entriesMap.get(monthYear) || 0) + 1);
        }
      });

      entriesMap.forEach((count, monthYear) => {
        if (this.outputTableStructure[monthYear]) {
          this.outputTableStructure[monthYear]['leads'] =this.outputTableStructure[monthYear]['leads'] +  count;
        } else {
          this.outputTableStructure[monthYear] = {
            month: monthYear,
            sales: count,
            leads: 0,
            conversion30: 0,
            conversion60: 0,
            conversion90: 0,
            conversion120: 0,
            conversion240: 0,
            conversion360: 0,
            conversion30conv: [],
            conversion60conv: [],
            conversion90conv: [],
            conversion120conv: [],
            conversion240conv: [],
            conversion360conv: []
          };
          this.tableData.push(monthYear);
        }
      });
    } catch (error) {
      console.error(`Error fetching ${collectionName} data:`, error);
    }
  }

  async calculateConversions(): Promise<void> {
    try {
      const leadsSnapshot = await this.firestore.collection('leads').get().toPromise();
      const entriesSnapshot = await this.firestore.collection('entries').get().toPromise();
      const lylregistrationSnapshot = await this.firestore.collection('lylregistration').get().toPromise();
      
      const entriesMap = new Map<string, { dates: Set<Date>, url: string }>();
      const lylregistrationMap = new Map<string, string>();
  
      [entriesSnapshot, lylregistrationSnapshot].forEach(snapshot => {
        snapshot.docs.forEach((doc: any) => {
          const element = doc.data();
          const email = element['email'];
          const phone = element['phone'] || ''; 
          const name = element['name'] || ''; 
          const dateField = doc.ref.parent.id === 'entries' ? 'createddate' : 'entrydata';
          const entryDate: Date | null = this.convertToDate(element[dateField]);
          const url = element['url'] || ''; 
  
          if (entryDate) {
            if (!entriesMap.has(email)) {
              entriesMap.set(email, { dates: new Set<Date>(), url: '' });
            }
            const entryInfo = entriesMap.get(email);
            if (entryInfo) {
              entryInfo.dates.add(entryDate);
              entryInfo.url = url; 
            }
          }
        });
      });
  
      const processedConversions = new Map<string, Set<string>>(); 
  
      leadsSnapshot.docs.forEach((doc: any) => {
        const element = doc.data();
        const email = element['email'];
        const name = element['name'] || ''; 
        const phone = element['mobile'] || '';
        const convertedDate: Date | null = this.convertToDate(element['converteddate']);
  
        if (convertedDate) {
          const monthYear = this.formatDateToMonthYear(convertedDate);
          const entryInfo = entriesMap.get(email);
          const dates = entryInfo ? entryInfo.dates : new Set<Date>();
          const url = entryInfo ? entryInfo.url : ''; 
  
          if (!processedConversions.has(email)) {
            processedConversions.set(email, new Set());
          }
          const processedMonths = processedConversions.get(email);
  
          dates.forEach(entryDate => {
            if (convertedDate > entryDate) {
              const diffDays = Math.floor((convertedDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
              const entryMonthYear = this.formatDateToMonthYear(entryDate);
  
              if (!processedMonths.has(entryMonthYear)) {
                if (!this.outputTableStructure[entryMonthYear]) {
                  this.outputTableStructure[entryMonthYear] = {
                    month: entryMonthYear,
                    sales: 0,
                    leads: 0,
                    conversion30: 0,
                    conversion60: 0,
                    conversion90: 0,
                    conversion120: 0,
                    conversion240: 0,
                    conversion360: 0,
                    conversion30conv: [],
                    conversion60conv: [],
                    conversion90conv: [],
                    conversion120conv: [],
                    conversion240conv: [],
                    conversion360conv: []
                  };
                }
                if (diffDays <= 30) {
                  this.outputTableStructure[entryMonthYear]['conversion30'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion30conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                } else if (diffDays <= 60) {
                  this.outputTableStructure[entryMonthYear]['conversion60'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion60conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                } else if (diffDays <= 90) {
                  this.outputTableStructure[entryMonthYear]['conversion90'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion90conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                } else if (diffDays <= 120) {
                  this.outputTableStructure[entryMonthYear]['conversion120'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion120conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                } else if (diffDays <= 240) {
                  this.outputTableStructure[entryMonthYear]['conversion240'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion240conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                } else if (diffDays <= 360) {
                  this.outputTableStructure[entryMonthYear]['conversion360'] += 1;
                  this.outputTableStructure[entryMonthYear]['conversion360conv'].push({
                    email,
                    name,
                    phone,
                    daydifference: diffDays,
                    url, 
                    createddate: entryDate.toISOString(),
                    converteddate: convertedDate.toISOString()
                  });
                }
                processedMonths.add(entryMonthYear);
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error calculating conversions:', error);
    }
  }

  onRowClick(row: any, conversion: any): void {
    let conversionData = [];
    
    if (conversion.includes('30')) {
      if (row.conversion30conv) conversionData = conversionData.concat(row.conversion30conv);
    }
    if (conversion.includes('60')) {
      if (row.conversion60conv) conversionData = conversionData.concat(row.conversion60conv);
    }
    if (conversion.includes('90')) {
      if (row.conversion90conv) conversionData = conversionData.concat(row.conversion90conv);
    }
    if (conversion.includes('120')) {
      if (row.conversion120conv) conversionData = conversionData.concat(row.conversion120conv);
    }
    if (conversion.includes('240')) {
      if (row.conversion240conv) conversionData = conversionData.concat(row.conversion240conv);
    }
    if (conversion.includes('360')) {
      if (row.conversion360conv) conversionData = conversionData.concat(row.conversion360conv);
    }
  
    this.dialog.open(ConversionDialogComponent, {
      data: { conversionData },
      width: '80%',
      height: '80%'
    });
  }
  

  // openSalesDialog(campaign: string) {
  //   const campaignData = this.outputTableStructure[campaign];
  //   if (campaignData && campaignData.leads && campaignData.leads.length > 0) {
  //     this.dialog.open(SalesdialogComponent, {
  //       data: {
  //         leads: campaignData.leads
  //       }
  //     });
  //   } else {
  //     console.log('No leads found for this campaign.');
  //   }
  // }

  ngAfterViewInit() {
   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.tableData).sort();
  }
  

  convertToDate(timestamp: any): Date | null {
    if (timestamp instanceof firebase.firestore.Timestamp) {
      return timestamp.toDate();
    }
    return timestamp ? new Date(timestamp) : null;
  }

  formatDateToMonthYear(date: Date): string {
    return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
  }

  parseMonthYear(monthYear: string): Date {
    const [month, year] = monthYear.split('-');
    const monthIndex = this.monthMap[month];
    return new Date(+year, monthIndex);
  }

  sortOutputTableStructure(): void {
    const sortedKeys = Object.keys(this.outputTableStructure)
      .sort((a, b) => this.parseMonthYear(a).getTime() - this.parseMonthYear(b).getTime());

    const sortedOutputTableStructure: any = {};
    sortedKeys.forEach(key => {
      sortedOutputTableStructure[key] = this.outputTableStructure[key];
    });

    this.outputTableStructure = sortedOutputTableStructure;
  }
}
