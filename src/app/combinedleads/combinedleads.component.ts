import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';
import { map, timestamp } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { LeadconvDialogComponent } from '../leadconv-dialog/leadconv-dialog.component';
import { CombinedDialogComponent } from '../combined-dialog/combined-dialog.component';

interface TableData {
  date: string;
  homepage: number;
  lylregister?: number;
}

@Component({
  selector: 'app-combinedleads',
  templateUrl: './combinedleads.component.html',
  styleUrls: ['./combinedleads.component.css']
})

export class CombinedleadsComponent implements OnInit {
  displayedColumns: string[] = ['date','lylreg', 'lyl30', 'lyl40', 'lyl100'];

  data: any[];

  dataSource = new MatTableDataSource<TableData>();
  isSearchClicked = false; 
  selectedStartDate!: Date | null;
  selectedEndDate!: Date | null;
  form!: FormGroup;
  fileName = 'ExportExcel.xlsx';
  maplylregistration : object = {}
  selectedSection: string = 'other';
  pageSize: number = 10;
  standalone: true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData:any [] = [];
  outputTableStructure:any = {}

  constructor(private firestore:AngularFirestore,private fb: FormBuilder,private dialog : MatDialog) { 
    
    this.firestore.collection('lylregistration').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
    
        if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {
    
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);
    
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylregister: 0, lylregistered: [], lylattended: 0 };
          this.outputTableStructure[datestring]['date'] = datestring;
          this.outputTableStructure[datestring]['lylregister'] = this.outputTableStructure[datestring]['lylregister'] != undefined
            ? this.outputTableStructure[datestring]['lylregister'] + 1
            : 1;
            this.outputTableStructure[datestring]['lylregistered'].push({
              name: element['name'],      
              email: element['email'],    
              phone: element['phone'],     
              url: element['url'],
              date: datestring  
            });
    
          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });
      // console.log(this.tableData);
      // console.log(this.outputTableStructure)
      this.ngAfterViewInit();
    });

    this.firestore.collection('lylregistration').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
        
        this.maplylregistration[element['entrydata']] = element;

        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });

        if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {

          let email = element['email'];
          let date = element['entrydata'];
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylattended: 0, lylattendedlead: [] };
          this.outputTableStructure[datestring]['date'] = datestring;

          let m = 'false';
          let a,b,c;
          let leadDetails: { name?: string, email?: string, phone?: string , date?: string} = {};

          let webinarSnap = await this.firestore.collection('lylwebinarattended').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              const dateelement = new Date(new Date(webinarElement['entrydate'].toDate()).getTime() + 330 * 60000)
              .toISOString()
              .substring(0, 10);
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone'],
                date: dateelement,
              };
            }
          });

          if (m == 'true') {
            this.outputTableStructure[datestring]['lylattended'] = this.outputTableStructure[datestring]['lylattended'] != undefined ? this.outputTableStructure[datestring]['lylattended'] + 1 : 1;
            this.outputTableStructure[datestring]['lylattendedlead'] = this.outputTableStructure[datestring]['lylattendedlead'] || [];
            this.outputTableStructure[datestring]['lylattendedlead'].push(leadDetails);
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      // console.log('lylnf', this.outputTableStructure);
      // console.log('tabnf', this.tableData);
      this.ngAfterViewInit();
    });

    this.firestore.collection('lylregistration').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
    
        this.maplylregistration[element['entrydata']] = element;
    
        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });
    
        if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {
    
          let email = element['email'];
          let date = element['entrydata'];
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylcomwat: 0, lylcomwatleads: [] };
          this.outputTableStructure[datestring]['date'] = datestring;
    
          let m = 'false';
          let a,b,c;
          let leadDetails: { name?: string, email?: string, phone?: string, date?: string } = {};
    
          let webinarSnap = await this.firestore.collection('lylweb30minswatch').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              const dateelement = new Date(new Date(webinarElement['entrydate'].toDate()).getTime() + 330 * 60000)
              .toISOString()
              .substring(0, 10);
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone'],
                date: dateelement
              };
            }
          });
    
          if (m == 'true') {
            this.outputTableStructure[datestring]['lylwatch30'] = this.outputTableStructure[datestring]['lylwatch30'] != undefined ? this.outputTableStructure[datestring]['lylwatch30'] + 1 : 1;
            this.outputTableStructure[datestring]['lylwatch30lead'] = this.outputTableStructure[datestring]['lylwatch30lead'] || [];
            this.outputTableStructure[datestring]['lylwatch30lead'].push(leadDetails);
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      // console.log('lylnf', this.outputTableStructure);
      // console.log('tabnf', this.tableData);
      this.ngAfterViewInit();
    });

    this.firestore.collection('lylregistration').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();

        this.maplylregistration[element['entrydata']] = element;

        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });

        if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {

          let email = element['email'];
          let date = element['entrydata'];
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylcomwat: 0, lylcomwatleads: [] };
          this.outputTableStructure[datestring]['date'] = datestring;

          let m = 'false';
          let a,b,c;
          let leadDetails: { name?: string, email?: string, phone?: string, date?: string } = {};

          let webinarSnap = await this.firestore.collection('lylwebcompletewatch').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              const dateelement = new Date(new Date(webinarElement['entrydate'].toDate()).getTime() + 330 * 60000)
              .toISOString()
              .substring(0, 10);
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone'],
                date: dateelement
              };
            }
          });

          if (m == 'true') {
            this.outputTableStructure[datestring]['lylcomwat'] = this.outputTableStructure[datestring]['lylcomwat'] != undefined ? this.outputTableStructure[datestring]['lylcomwat'] + 1 : 1;
            this.outputTableStructure[datestring]['lylcomwatlead'] = this.outputTableStructure[datestring]['lylcomwatlead'] || [];
            this.outputTableStructure[datestring]['lylcomwatlead'].push(leadDetails);
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      // console.log('lylnf', this.outputTableStructure);
      // console.log('tabnf', this.tableData);
      this.ngAfterViewInit();
    });

    this.firestore.collection('lylregistration').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
    
        this.maplylregistration[element['entrydata']] = element;
    
        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });
    
        if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {
    
          let email = element['email'];
          let date = element['entrydata'];
          let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylapplied: 0, lylappliedleads: [] };
          this.outputTableStructure[datestring]['date'] = datestring;

          let m = 'false';
          let a,b,c;
          let leadDetails: { name?: string, email?: string, phone?: string, date?: string } = {};

          let webinarSnap = await this.firestore.collection('lylapplied').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              const dateelement = new Date(new Date(webinarElement['entrydate'].toDate()).getTime() + 330 * 60000)
              .toISOString()
              .substring(0, 10);
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone'],
                date: dateelement
              };
            }
          });

          if (m == 'true') {
            this.outputTableStructure[datestring]['lylapplied'] = this.outputTableStructure[datestring]['lylapplied'] != undefined ? this.outputTableStructure[datestring]['lylapplied'] + 1 : 1;
            this.outputTableStructure[datestring]['lylappliedlead'] = this.outputTableStructure[datestring]['lylappliedlead'] || [];
            this.outputTableStructure[datestring]['lylappliedlead'].push(leadDetails);
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      console.log('lylnf', this.outputTableStructure);
      console.log('tabnf', this.tableData);
      this.ngAfterViewInit();
    });
   }

   onRowClick(row: any, conversion: string, start: any, end: any): void {
    console.log('Row clicked', row);
  
    let conversionData: any[] = [];
  
    if (conversion === 'lylregistered') {
      if (row.lylregistered) {
        conversionData = conversionData.concat(row.lylregistered);
      }
  
      if (!this.tableData.length) {
        return;
      }
  
      this.data = this.dataSource.data;
  
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
  
      this.data.forEach((date) => {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          conversionData = conversionData.concat(this.outputTableStructure[date]?.lylregistered || []);
        }
      });
    } else  if (conversion === 'lylattended30') {
      if (row.lylregistered) {
        conversionData = conversionData.concat(row.lylwatch30lead);
      }
  
      if (!this.tableData.length) {
        return;
      }
  
      this.data = this.dataSource.data;
  
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
  
      this.data.forEach((date) => {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          conversionData = conversionData.concat(this.outputTableStructure[date]?.lylwatch30lead || []);
        }
      });
    } else  if (conversion === 'lylattended') {
      if (row.lylregistered) {
        conversionData = conversionData.concat(row.lylattendedlead);
      }
  
      if (!this.tableData.length) {
        return;
      }
  
      this.data = this.dataSource.data;
  
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
  
      this.data.forEach((date) => {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          conversionData = conversionData.concat(this.outputTableStructure[date]?.lylattendedlead || []);
        }
      });
    } else  if (conversion === 'lylcomwat') {
      if (row.lylregistered) {
        conversionData = conversionData.concat(row.lylcomwatlead);
      }
  
      if (!this.tableData.length) {
        return;
      }
  
      this.data = this.dataSource.data;
  
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
  
      this.data.forEach((date) => {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          conversionData = conversionData.concat(this.outputTableStructure[date]?.lylcomwatlead || []);
        }
      });
    } 
    // else if (conversion === 'lylattend') {
    //   if (row.lylattendedlead) {
    //     conversionData = conversionData.concat(row.lylattendedlead);
    //   }
    // } else if (conversion === 'lylattendedtoday') {
    //   if (row.lylattendedtodaylead) {
    //     conversionData = conversionData.concat(row.lylattendedtodaylead);
    //   }
    // } else if (conversion === 'lylcomwat') {
    //   if (row.lylcomwatlead) {
    //     conversionData = conversionData.concat(row.lylcomwatlead);
    //   }
    // } else if (conversion === 'lylcomwattoday') {
    //   if (row.lylcomwattodaylead) {
    //     conversionData = conversionData.concat(row.lylcomwattodaylead);
    //   }
    // } else if (conversion === 'lylapplied') {
    //   if (row.lylappliedlead) {
    //     conversionData = conversionData.concat(row.lylappliedlead);
    //   }
    // } else if (conversion === 'lylappliedtoday') {
    //   if (row.lylappliedtodaylead) {
    //     conversionData = conversionData.concat(row.lylappliedtodaylead);
    //   }
    // } else if (conversion === 'lylwatch30lead') {
    //   if (row.lylwatch30lead) {
    //     conversionData = conversionData.concat(row.lylwatch30lead);
    //   }
    // }
  
    console.log('Filtered conversionData:', conversionData);
  
    this.dialog.open(CombinedDialogComponent, {
      data: { conversionData },
      width: '80%',
      height: '80%'
    });
  }
  

  // onRowClick(row: any, conversion: string): void {
  //   console.log('Row clicked', row); 

  //   // This array will hold the conversion data to display
  //   let conversionData = [];

  //   // Check the conversion type and extract the relevant data
  //   if (conversion === 'lylregistered') {
  //     if (row.lylregistered) {
  //       conversionData = [...row.lylregistered]; // Use spread operator if it's an array
  //     }
  //   } else if (conversion === 'lylattend') {
  //     if (row.lylattendedlead) {
  //       conversionData = [...row.lylattendedlead];
  //     }
  //   } else if (conversion === 'lylattendedtoday') {
  //     if (row.lylattendedtodaylead) {
  //       conversionData = [...row.lylattendedtodaylead];
  //     }
  //   } else if (conversion === 'lylcomwat') {
  //     if (row.lylcomwatlead) {
  //       conversionData = [...row.lylcomwatlead];
  //     }
  //   } else if (conversion === 'lylcomwattoday') {
  //     if (row.lylcomwattodaylead) {
  //       conversionData = [...row.lylcomwattodaylead];
  //     }
  //   } else if (conversion === 'lylapplied') {
  //     if (row.lylappliedlead) {
  //       conversionData = [...row.lylappliedlead];
  //     }
  //   } else if (conversion === 'lylappliedtoday') {
  //     if (row.lylappliedtodaylead) {
  //       conversionData = [...row.lylappliedtodaylead];
  //     }
  //   } else if (conversion === 'lylwatch30lead') {
  //     if (row.lylwatch30lead) {
  //       conversionData = [...row.lylwatch30lead];
  //     }
  //   }

  //   // Open the dialog and pass the conversion data
  //   this.dialog.open(LeadconvDialogComponent, {
  //     data: { conversionData }, 
  //     width: '80%',
  //     height: '80%'
  //   });
  // }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.tableData).sort();
  }
  getFormattedDate(timestamp): string {
    const date = new Date(timestamp.toMillis());
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      daterange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });

  }

  getlylregisterdata(startDate: Date, endDate: Date): any[] {
    if (!this.tableData.length) {
      return [];
    }

    this.data = this.dataSource.data;

    return this.data.reduce((acc, date) => {
      const currentDate = new Date(date);
      if (currentDate >= startDate && currentDate <= endDate ) {
        return acc.concat(this.outputTableStructure[date]?.lylregistered || []);
      }
      return acc;
    }, []);
  }

  getlylregister(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylregister || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattend(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylattended || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattendedtoday(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylattendedtoday || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylcomwat(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylcomwat || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattend30(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylwatch30 || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylcomwattoday(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylcomwattoday || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylapplied(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylapplied || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylappliedtoday(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylappliedtoday || 0).reduce((acc, value) => acc + value, 0);
  }

  onSubmit() {
    if (this.form.value.daterange && this.form.value.daterange.start && this.form.value.daterange.end) {
      this.selectedStartDate = this.form.value.daterange.start;
      this.selectedEndDate = this.form.value.daterange.end;
      this.isSearchClicked = true; 
      this.filterDataByDateRange();
    }
  }

  filterDataByDateRange() {
    if (this.selectedStartDate && this.selectedEndDate) {
      console.log(this.selectedStartDate,this.selectedEndDate)
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      endDate.setDate(endDate.getDate() +1)
      console.log(startDate,endDate)
      this.dataSource.data = this.tableData.filter(datestring => {
        const date = new Date(datestring);
        return date >= startDate && date <= endDate;
      });
    }
  }

}
