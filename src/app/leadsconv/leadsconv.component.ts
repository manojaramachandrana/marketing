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
import { timestamp } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { LeadconvDialogComponent } from '../leadconv-dialog/leadconv-dialog.component';

interface TableData {
  date: string;
  homepage: number;
  lylregister?: number;
}

@Component({
  selector: 'app-leadsconv',
  templateUrl: './leadsconv.component.html',
  styleUrls: ['./leadsconv.component.css']
})
export class LeadsconvComponent implements OnInit {
  displayedColumns: string[] = ['date','lylreg','lylattend','lylcomwat','lylapplied'];
    //,'lylattendedtoday','lylcomwattoday', 'lylappliedtoday'];
  displayedColumn: string[] = ['date','lylreg'];
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

  entrySubscriptiion: Subscription = new Subscription;
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
              url: element['url']       
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

    this.firestore.collection('lylwebinarattended').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        
        if (element['entrydate'] != undefined) {
          let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);

          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
          this.outputTableStructure[datestring]['date'] = datestring;
          this.outputTableStructure[datestring]['lylattendedtoday'] = this.outputTableStructure[datestring]['lylattendedtoday'] != undefined
            ? this.outputTableStructure[datestring]['lylattendedtoday'] + 1
            : 1;
            this.outputTableStructure[datestring]['lylattendedtodaylead'] = this.outputTableStructure[datestring]['lylattendedtodaylead'] || [];
            this.outputTableStructure[datestring]['lylattendedtodaylead'].push({
              name: element['name'],      
              email: element['email'],    
              phone: element['phone'],           
            });

          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });

      this.ngAfterViewInit();
    });

    //lyl webinar complete watch
this.firestore.collection('lylwebcompletewatch').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();

    if (element['entrydate'] != undefined) {
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['lylcomwattoday'] = this.outputTableStructure[datestring]['lylcomwattoday'] != undefined
        ? this.outputTableStructure[datestring]['lylcomwattoday'] + 1
        : 1;
        this.outputTableStructure[datestring]['lylcomwattodaylead'] = this.outputTableStructure[datestring]['lylcomwattodaylead'] || [];
        this.outputTableStructure[datestring]['lylcomwattodaylead'].push({
          name: element['name'],      
          email: element['email'],    
          phone: element['phone'],           
        });

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//lyl application
this.firestore.collection('lylapplied').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (element['entrydate'] != undefined) {
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['lylappliedtoday'] = this.outputTableStructure[datestring]['lylappliedtoday'] != undefined 
        ? this.outputTableStructure[datestring]['lylappliedtoday'] + 1 
        : 1;
        this.outputTableStructure[datestring]['lylappliedtodaylead'] = this.outputTableStructure[datestring]['lylappliedtodaylead'] || [];

        this.outputTableStructure[datestring]['lylappliedtodaylead'].push({
          name: element['name'],      
          email: element['email'],    
          phone: element['phone'],           
        });

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

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
          let leadDetails: { name?: string, email?: string, phone?: string } = {};

          let webinarSnap = await this.firestore.collection('lylwebinarattended').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone']
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
          let leadDetails: { name?: string, email?: string, phone?: string } = {};
    
          let webinarSnap = await this.firestore.collection('lylwebcompletewatch').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone']
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
          let leadDetails: { name?: string, email?: string, phone?: string } = {};
    
          let webinarSnap = await this.firestore.collection('lylapplied').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydate'] != undefined && webinarElement['entrydate'] >= date && webinaremail == email) {
              m = 'true';
              leadDetails = {
                name: webinarElement['name'],
                email: webinarElement['email'],
                phone: webinarElement['phone']
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

  onRowClick(row: any, conversion: string): void {
    console.log('Row clicked', row); 
    console.log('row',row.lylregistered) 
    let conversionData = [];
    
    if ( conversion === 'lylregistered') {
      if (row.lylregistered) conversionData = conversionData.concat(row.lylregistered);
    } else if ( conversion === 'lylattend') {
      if (row.lylattendedlead) conversionData = conversionData.concat(row.lylattendedlead);
    }else if ( conversion === 'lylattendedtoday') {
      if (row.lylattendedtodaylead) conversionData = conversionData.concat(row.lylattendedtodaylead);
    }else if ( conversion === 'lylcomwat') {
      if (row.lylcomwatlead) conversionData = conversionData.concat(row.lylcomwatlead);
    }else if ( conversion === 'lylcomwattoday') {
      if (row.lylcomwattodaylead) conversionData = conversionData.concat(row.lylcomwattodaylead);
    }else if ( conversion === 'lylapplied') {
      if (row.lylappliedlead) conversionData = conversionData.concat(row.lylappliedlead);
    }else if ( conversion === 'lylappliedtoday') {
      if (row.lylappliedtodaylead) conversionData = conversionData.concat(row.lylappliedtodaylead);
    }
    
    this.dialog.open(LeadconvDialogComponent, {
      data: { conversionData }, 
      width: '80%',
      height: '80%'
    });
  }

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
