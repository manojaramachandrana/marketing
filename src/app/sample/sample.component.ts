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
//import { Timestamp } from 'rxjs/internal/operators/timestamp';
// import { firestore } from 'firebase/app';
// import Timestamp = firestore.Timestamp;

interface TableData {
  date: string;
  homepage: number;
  lylregister?: number;
}

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
})
export class SampleComponent implements OnInit {
  displayedColumns: string[] = ['date','homepage','lylreg','lylattend','lylcomwat','lylapplied','loghot','superopportunity','sales','totalpurchasevalue','initialpayment','amountspend'];
  displayedColumnshp: string[] = ['date','homepage','lylreg','lylattend','lylcomwat','lylapplied','sales','totalpurchasevalue','initialpayment','amountspend'];
  displayedColumnslyl: string[] = ['date','lylreg','lylattend','lylcomwat','lylapplied','sales','totalpurchasevalue','initialpayment','amountspend'];
  data: any[];
  
  dataSource = new MatTableDataSource<TableData>();
  //  dataSource2 = new MatTableDataSource();
  //  dataSource3 = new MatTableDataSource();
  selectedStartDate!: Date | null;
  selectedEndDate!: Date | null;
  form!: FormGroup;
  fileName = 'ExportExcel.xlsx';
  maplylregistration : object = {}
  selectedSection: string = 'other';
  pageSize: number = 10;
  standalone: true;
  //dataLoading: boolean = true;

  // dataSource = new MatTableDataSource();
  // @ViewChild('Sort') Sort = new MatSort();
  // @ViewChild('Paginator') Paginator: MatPaginator;

  // dataSourcehp = new MatTableDataSource();
  // @ViewChild('hpSort') hpSort = new MatSort();
  // @ViewChild('Paginatorhp') Paginatorhp: MatPaginator;

  // dataSourcelyl = new MatTableDataSource();
  // @ViewChild('lylSort') lylSort = new MatSort();
  // @ViewChild('Paginatorlyl') Paginatorlyl: MatPaginator;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginatorhp: MatPaginator;
  // @ViewChild(MatPaginator) paginatorlyl: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData:any [] = [];
  outputTableStructure:any = {}
  //dialog: any;
  
  // get loadingdialog(){
  //   return this.dialog.open(SpinnerComponent,{data:{msg:'Please wait processing.....'},disableClose:true})
  // }

  entrySubscriptiion: Subscription = new Subscription;
  constructor(
    private firestore:AngularFirestore,private fb: FormBuilder,private dialog : MatDialog
  ) { 
    //this.getfunctions()}
    // ,ref => ref.where('createddate',">=",new Date(2024,0,31)).where("createddate","<=",new Date(2024,1,2))
//getfunctions(){
//entries
    //this.loadingdialog();
    this.firestore.collection('entries').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        if (element['createddate'] != undefined) {
          let datestring = new Date(new Date(element['createddate'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);
    
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", homepage: 0 };
          this.outputTableStructure[datestring]['date'] = datestring;
          this.outputTableStructure[datestring]['homepage'] = this.outputTableStructure[datestring]['homepage'] + 1;
    
          if (!this.tableData.includes(datestring)) {
            this.tableData.push(datestring);
          }
        }
      });
    
      this.ngAfterViewInit();
    });
    
//lylregistration
this.firestore.collection('lylregistration').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();

    if (element['entrydata'] != undefined && element['event'] == 'lylregistration') {

      let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylregister: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['lylregister'] = this.outputTableStructure[datestring]['lylregister'] != undefined
        ? this.outputTableStructure[datestring]['lylregister'] + 1
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//lylregistration from homepage
this.firestore.collection('lylregistration').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (
      element['entrydata'] != undefined &&
      element['event'] == 'lylregistration' &&
      (
        element['qa1'] == 'nil' ||
        element['qa2'] == 'nil' ||
        element['url'].includes('www.antanoharini.com') ||
        element['url'] == 'lyl ewebinar'
      )
    ) {
      let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylregisterfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['lylregisterfromhp'] = this.outputTableStructure[datestring]['lylregisterfromhp'] != undefined
        ? this.outputTableStructure[datestring]['lylregisterfromhp'] + 1
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//lylregistration not from homepage
this.firestore.collection('lylregistration').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (element['entrydata'] != undefined && element['event'] == 'lylregistration' && element['url'].includes('global.antanoharini.com')) {
      let datestring = new Date(new Date(element['entrydata'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylregisternotfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['lylregisternotfromhp'] = this.outputTableStructure[datestring]['lylregisternotfromhp'] != undefined
        ? this.outputTableStructure[datestring]['lylregisternotfromhp'] + 1
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//lyl attended
    this.firestore.collection('lylwebinarattended').get().toPromise().then(snap => {
      snap.docs.forEach((doc: any) => {
        const element = doc.data();
        
        if (element['entrydate'] != undefined) {
          let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
            .toISOString()
            .substring(0, 10);

          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
          this.outputTableStructure[datestring]['date'] = datestring;
          this.outputTableStructure[datestring]['lylattended'] = this.outputTableStructure[datestring]['lylattended'] != undefined
            ? this.outputTableStructure[datestring]['lylattended'] + 1
            : 1;

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
      this.outputTableStructure[datestring]['lylcomwat'] = this.outputTableStructure[datestring]['lylcomwat'] != undefined
        ? this.outputTableStructure[datestring]['lylcomwat'] + 1
        : 1;

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
      this.outputTableStructure[datestring]['lylapplied'] = this.outputTableStructure[datestring]['lylapplied'] != undefined 
        ? this.outputTableStructure[datestring]['lylapplied'] + 1 
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//loghot 
this.firestore.collection('loghot').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (element['entrydate'] != undefined) {
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['loghot'] = this.outputTableStructure[datestring]['loghot'] != undefined 
        ? this.outputTableStructure[datestring]['loghot'] + 1 
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//super opportunities
this.firestore.collection('superhotopportunities').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (element['entrydate'] != undefined) {
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['superopportunity'] = this.outputTableStructure[datestring]['superopportunity'] != undefined 
        ? this.outputTableStructure[datestring]['superopportunity'] + 1 
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//sales
this.firestore.collection('leads').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();

    if (element['purchasedate'] != undefined) {
      let day = new firebase.firestore.Timestamp(
        element['purchasedate']['_seconds'], 
        element['purchasedate']['_nanoseconds']
      );
      let datestring = new Date(new Date(day.toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      this.outputTableStructure[datestring]['sales'] = this.outputTableStructure[datestring]['sales'] != undefined 
        ? this.outputTableStructure[datestring]['sales'] + 1 
        : 1;

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//sales totalpurchasevalue
this.firestore.collection('leads').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();

    if (element['purchasedate'] != undefined) {
      let day = new firebase.firestore.Timestamp(
        element['purchasedate']['_seconds'], 
        element['purchasedate']['_nanoseconds']
      );
      let datestring = new Date(new Date(day.toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;
      
      this.outputTableStructure[datestring]['totalpurchasevalue'] = 
        this.outputTableStructure[datestring]['totalpurchasevalue'] != undefined && this.outputTableStructure[datestring]['totalpurchasevalue'] !== null
        ? this.outputTableStructure[datestring]['totalpurchasevalue'] + element['totalpurchasevalue']
        : element['totalpurchasevalue'];

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//sales initial payment
this.firestore.collection('leads').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();

    if (element['purchasedate'] != undefined) {
      let day = new firebase.firestore.Timestamp(
        element['purchasedate']['_seconds'], 
        element['purchasedate']['_nanoseconds']
      );
      let datestring = new Date(new Date(day.toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;

      this.outputTableStructure[datestring]['initialpayment'] =
        this.outputTableStructure[datestring]['initialpayment'] != undefined && this.outputTableStructure[datestring]['initialpayment'] !== null
        ? this.outputTableStructure[datestring]['initialpayment'] + element['initialpayment']
        : element['initialpayment'];

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

//total amount ad spend
this.firestore.collection('adsinsight').get().toPromise().then(snap => {
  snap.docs.forEach((doc: any) => {
    const element = doc.data();
    
    if (element['docdate'] != undefined) {
      let datestring = new Date(new Date(element['docdate'].toDate()).getTime() + 330 * 60000)
        .toISOString()
        .substring(0, 10);

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || {};
      this.outputTableStructure[datestring]['date'] = datestring;

      this.outputTableStructure[datestring]['amountSpend'] =
        this.outputTableStructure[datestring]['amountSpend'] != undefined && this.outputTableStructure[datestring]['amountSpend'] !== null
        ? this.outputTableStructure[datestring]['amountSpend'] + element['amountSpend']
        : element['amountSpend'];

      if (!this.tableData.includes(datestring)) {
        this.tableData.push(datestring);
      }
    }
  });

  this.ngAfterViewInit();
});

    //let loadingref = this.loadingdialog
//lyl attended from homepage
this.firestore.collection('lylwebinarattended').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['entrydate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['entrydate'] !== undefined) {
      let email = element['email'].trim();
      let date = element['entrydate']; 
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0,10)

      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylattendedfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();

        if (webinarElement['entrydata'] !== undefined && webinarElement['entrydata'] <= date && webinaremail === email &&
            webinarElement['event'] === 'lylregistration' && webinarElement['event'] == 'lylregistration' &&
                    (webinarElement['qa1'] == 'nil' || webinarElement['qa2'] == 'nil' || webinarElement['url'].includes('www.antanoharini.com') || webinarElement['url'] == 'lyl ewebinar') ) {
          m = 'true';
        }
      });

      if (m === 'true') {
        this.outputTableStructure[datestring]['lylattendedfromhp'] = this.outputTableStructure[datestring]['lylattendedfromhp'] != undefined ? this.outputTableStructure[datestring]['lylattendedfromhp'] + 1 : 1;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
}).catch(error => {
  console.error('Error getting documents: ', error);
});
    
//lyl attended not from homepage
    this.firestore.collection('lylwebinarattended').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
    
        this.maplylregistration[element['entrydate']] = element;

        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });
    
        if (element['entrydate'] !== undefined) {
          let email = element['email'].trim();
          let date = element['entrydate']; 
          let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0,10)
    
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylattendednotfromhp: 0 };
          this.outputTableStructure[datestring]['date'] = datestring;
    
          let m = 'false';
    
          let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
    
            if (webinarElement['entrydata'] !== undefined && webinarElement['entrydata'] <= date && webinaremail === email &&
                webinarElement['event'] === 'lylregistration' && webinarElement['url'].includes('global.antanoharini.com') ) {
              m = 'true';
            }
          });
    
          if (m === 'true') {
            this.outputTableStructure[datestring]['lylattendednotfromhp'] = this.outputTableStructure[datestring]['lylattendednotfromhp'] != undefined ? this.outputTableStructure[datestring]['lylattendednotfromhp'] + 1 : 1;
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      this.ngAfterViewInit();
    }).catch(error => {
      console.error('Error getting documents: ', error);
    });


//lyl com watch from homepage
    this.firestore.collection('lylwebcompletewatch').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
    
        this.maplylregistration[element['entrydate']] = element;
    
        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });
    
        if (element['entrydate'] != undefined) {
    
          let email = element['email'].trim();
          let date = element['entrydate'];
          let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylcomwatfromhp: 0 };
          this.outputTableStructure[datestring]['date'] = datestring;
    
          let m = 'false';
    
          let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email  && webinarElement['event'] == 'lylregistration' &&
              (webinarElement['qa1'] == 'nil' || webinarElement['qa2'] == 'nil' || webinarElement['url'].includes('www.antanoharini.com') || webinarElement['url'] == 'lyl ewebinar')) {
              m = 'true';
            }
          });
    
          if (m == 'true') {
            this.outputTableStructure[datestring]['lylcomwatfromhp'] = this.outputTableStructure[datestring]['lylcomwatfromhp'] != undefined ? this.outputTableStructure[datestring]['lylcomwatfromhp'] + 1 : 1;
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      this.ngAfterViewInit();
    });
//lyl com watch not from homepage
this.firestore.collection('lylwebcompletewatch').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['entrydate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['entrydate'] != undefined) {

      let email = element['email'].trim();
      let date = element['entrydate'];
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylcomwatnotfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();
        if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email  && webinarElement['event'] == 'lylregistration' &&
           webinarElement['url'].includes('global.antanoharini.com')) {
          m = 'true';
        }
      });

      if (m == 'true') {
        this.outputTableStructure[datestring]['lylcomwatnotfromhp'] = this.outputTableStructure[datestring]['lylcomwatnotfromhp'] != undefined ? this.outputTableStructure[datestring]['lylcomwatnotfromhp'] + 1 : 1;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
});

//lyl application from homepage
this.firestore.collection('lylapplied').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['entrydate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['entrydate'] != undefined) {

      let email = element['email'].trim();
      let date = element['entrydate'];
      let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylappliedfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();
        if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email  && webinarElement['event'] == 'lylregistration' &&
          (webinarElement['qa1'] == 'nil' || webinarElement['qa2'] == 'nil' || webinarElement['url'].includes('www.antanoharini.com') || webinarElement['url'] == 'lyl ewebinar')) {
          m = 'true';
        }
      });

      if (m == 'true') {
        this.outputTableStructure[datestring]['lylappliedfromhp'] = this.outputTableStructure[datestring]['lylappliedfromhp'] != undefined ? this.outputTableStructure[datestring]['lylappliedfromhp'] + 1 : 1;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
});
//lyl application not from homepage
this.firestore.collection('lylapplied').get().toPromise().then(async snap => {
snap.docs.forEach(async doc => {
const element = doc.data();

this.maplylregistration[element['entrydate']] = element;

Object.keys(this.maplylregistration).forEach(key => {
  //console.log(element[element['entrydata']]);
});

if (element['entrydate'] != undefined) {

  let email = element['email'].trim();
  let date = element['entrydate'];
  let datestring = new Date(new Date(element['entrydate'].toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
  this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", lylappliednotfromhp: 0 };
  this.outputTableStructure[datestring]['date'] = datestring;

  let m = 'false';

  let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
  webinarSnap.docs.forEach(webinarDoc => {
    const webinarElement = webinarDoc.data();
    let webinaremail = webinarElement['email'].trim();
    if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email  && webinarElement['event'] == 'lylregistration' &&
       webinarElement['url'].includes('global.antanoharini.com')) {
      m = 'true';
    }
  });

  if (m == 'true') {
    this.outputTableStructure[datestring]['lylappliednotfromhp'] = this.outputTableStructure[datestring]['lylappliednotfromhp'] != undefined ? this.outputTableStructure[datestring]['lylappliednotfromhp'] + 1 : 1;
    if (!this.tableData.includes(datestring)) {
      this.tableData.push(datestring);
    }
  }
}
});
this.ngAfterViewInit();
});

//sales from homepage
    this.firestore.collection('leads').get().toPromise().then(async snap => {
      snap.docs.forEach(async doc => {
        const element = doc.data();
    
        this.maplylregistration[element['purchasedate']] = element;
    
        Object.keys(this.maplylregistration).forEach(key => {
          //console.log(element[element['entrydata']]);
        });
    
        if (element['purchasedate'] != undefined) {
    
          let email = element['email'];
          let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
          let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
          this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", salesfromhp: 0 };
          this.outputTableStructure[datestring]['date'] = datestring;
    
          let m = 'false';
    
          let webinarSnap = await this.firestore.collection('entries').get().toPromise();
          webinarSnap.docs.forEach(webinarDoc => {
            const webinarElement = webinarDoc.data();
            let webinaremail = webinarElement['email'].trim();
            if (webinarElement['createddate'] != undefined && webinarElement['createddate'] <= date && webinaremail == email) {
              m = 'true';
            }
          });
    
          if (m == 'true') {
            this.outputTableStructure[datestring]['salesfromhp'] = this.outputTableStructure[datestring]['salesfromhp'] != undefined ? this.outputTableStructure[datestring]['salesfromhp'] + 1 : 1;
            if (!this.tableData.includes(datestring)) {
              this.tableData.push(datestring);
            }
          }
        }
      });
      this.ngAfterViewInit();
    });
//sales not from homepage
this.firestore.collection('leads').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['purchasedate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['purchasedate'] != undefined) {

      let email = element['email'];
      let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
      let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", salesnotfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();
        if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email && webinarElement['event'] == 'lylregistration' &&
          webinarElement['url'].includes('global.antanoharini.com')) {
          m = 'true';
        }
      });

      if (m == 'true') {
        this.outputTableStructure[datestring]['salesnotfromhp'] = this.outputTableStructure[datestring]['salesnotfromhp'] != undefined ? this.outputTableStructure[datestring]['salesnotfromhp'] + 1 : 1;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
});

//sales totalpurchasevalue from homepage
this.firestore.collection('leads').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['purchasedate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['purchasedate'] != undefined) {

      let email = element['email'];
      let totalpurchasevalue = element['totalpurchasevalue'];
      let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
      let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", salesfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('entries').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();
        if (webinarElement['createddate'] != undefined && webinarElement['createddate'] <= date && webinaremail == email) {
          m = 'true';
        }
      });

      if (m == 'true') {
        this.outputTableStructure[datestring]['totalpurchasevaluefromhp'] = this.outputTableStructure[datestring]['totalpurchasevaluefromhp'] != undefined ? this.outputTableStructure[datestring]['totalpurchasevaluefromhp'] + totalpurchasevalue : totalpurchasevalue;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
});
//sales totalpurchase not from homepage
this.firestore.collection('leads').get().toPromise().then(async snap => {
snap.docs.forEach(async doc => {
const element = doc.data();

this.maplylregistration[element['purchasedate']] = element;

Object.keys(this.maplylregistration).forEach(key => {
  //console.log(element[element['entrydata']]);
});

if (element['purchasedate'] != undefined) {

  let email = element['email'];
  let totalpurchasevalue = element['totalpurchasevalue'];
  let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
  let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
  this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", salesnotfromhp: 0 };
  this.outputTableStructure[datestring]['date'] = datestring;

  let m = 'false';

  let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
  webinarSnap.docs.forEach(webinarDoc => {
    const webinarElement = webinarDoc.data();
    let webinaremail = webinarElement['email'].trim();
    if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email && webinarElement['event'] == 'lylregistration' &&
      webinarElement['url'].includes('global.antanoharini.com')) {
      m = 'true';
    }
  });

  if (m == 'true') {
    this.outputTableStructure[datestring]['totalpurchasevaluenotfromhp'] = this.outputTableStructure[datestring]['totalpurchasevaluenotfromhp'] != undefined ? this.outputTableStructure[datestring]['totalpurchasevaluenotfromhp'] + totalpurchasevalue : totalpurchasevalue;
    if (!this.tableData.includes(datestring)) {
      this.tableData.push(datestring);
    }
  }
}
});
this.ngAfterViewInit();
});

//sales initialpayment from homepage
this.firestore.collection('leads').get().toPromise().then(async snap => {
  snap.docs.forEach(async doc => {
    const element = doc.data();

    this.maplylregistration[element['purchasedate']] = element;

    Object.keys(this.maplylregistration).forEach(key => {
      //console.log(element[element['entrydata']]);
    });

    if (element['purchasedate'] != undefined) {

      let email = element['email'];
      let totalpurchasevalue = element['initialpayment'];
      let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
      let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
      this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", initialpaymentfromhp: 0 };
      this.outputTableStructure[datestring]['date'] = datestring;

      let m = 'false';

      let webinarSnap = await this.firestore.collection('entries').get().toPromise();
      webinarSnap.docs.forEach(webinarDoc => {
        const webinarElement = webinarDoc.data();
        let webinaremail = webinarElement['email'].trim();
        if (webinarElement['createddate'] != undefined && webinarElement['createddate'] <= date && webinaremail == email) {
          m = 'true';
        }
      });

      if (m == 'true') {
        this.outputTableStructure[datestring]['initialpaymentfromhp'] = this.outputTableStructure[datestring]['initialpaymentfromhp'] != undefined ? this.outputTableStructure[datestring]['initialpaymentfromhp'] + totalpurchasevalue : totalpurchasevalue;
        if (!this.tableData.includes(datestring)) {
          this.tableData.push(datestring);
        }
      }
    }
  });
  this.ngAfterViewInit();
});
//sales initialpayment not from homepage
this.firestore.collection('leads').get().toPromise().then(async snap => {
snap.docs.forEach(async doc => {
const element = doc.data();

this.maplylregistration[element['purchasedate']] = element;

Object.keys(this.maplylregistration).forEach(key => {
  //console.log(element[element['entrydata']]);
});

if (element['purchasedate'] != undefined) {

  let email = element['email'];
  let totalpurchasevalue = element['initialpayment'];
  let date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] );
  let datestring = new Date(new Date(date.toDate()).getTime() + 330 * 60000).toISOString().substring(0, 10);
  this.outputTableStructure[datestring] = this.outputTableStructure[datestring] || { date: "", salesnotfromhp: 0 };
  this.outputTableStructure[datestring]['date'] = datestring;

  let m = 'false';

  let webinarSnap = await this.firestore.collection('lylregistration').get().toPromise();
  webinarSnap.docs.forEach(webinarDoc => {
    const webinarElement = webinarDoc.data();
    let webinaremail = webinarElement['email'].trim();
    if (webinarElement['entrydata'] != undefined && webinarElement['entrydata'] <= date && webinaremail == email && webinarElement['event'] == 'lylregistration' &&
      webinarElement['url'].includes('global.antanoharini.com')) {
      m = 'true';
    }
  });

  if (m == 'true') {
    this.outputTableStructure[datestring]['initialpaymentnotfromhp'] = this.outputTableStructure[datestring]['initialpaymentnotfromhp'] != undefined ? this.outputTableStructure[datestring]['initialpaymentnotfromhp'] + totalpurchasevalue : totalpurchasevalue;
    if (!this.tableData.includes(datestring)) {
      this.tableData.push(datestring);
    }
  }
}
});
this.ngAfterViewInit();
});


    // this.firestore.collection('leads').get().toPromise().then(snap => {
    //   for (let i = 0; i < snap.docs.length; i++) {
    //     const element:any = snap.docs[0].data();

    //      //const date = new Date(element['purchasedate']['_seconds'] * 1000);
    //      const date = new firebase.firestore.Timestamp(element['purchasedate']['_seconds'],element['purchasedate']['_nanoseconds'] )
    //      console.log('date',date,element['email'],element['purchasedate'],element['converteddate'])
    //     break;
    //   }
    // });

   }
   getFormattedDate(timestamp): string {
    const date = new Date(timestamp.toMillis());
    //const date = timestamp;
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
      console.log(this.selectedStartDate,this.selectedEndDate)
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      endDate.setDate(endDate.getDate() +1)
      console.log(startDate,endDate)
      this.dataSource.data = this.tableData.filter(datestring => {
        const date = new Date(datestring);
        return date >= startDate && date <= endDate;
      });
      //this.dataSource.paginator = this.paginator;
      // this.dataSource2.paginator = this.paginator2;
      // this.dataSource3.paginator = this.paginator3;
    }
    //this.gethomepage()
  }

  gethomepage(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.homepage || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylregister(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylregister || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylregisterfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylregisterfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylregisternotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylregisternotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattended(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylattended || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattendedfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylattendedfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylattendednotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylattendednotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylcomwat(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylcomwat || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylcomwatfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylcomwatfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylcomwatnotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylcomwatnotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylapplied(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylapplied || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylappliedfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylappliedfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getlylappliednotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.lylappliednotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getloghot(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.loghot || 0).reduce((acc, value) => acc + value, 0);
  }
  getsuperopportunity(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.superopportunity || 0).reduce((acc, value) => acc + value, 0);
  }
  getsales(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.sales || 0).reduce((acc, value) => acc + value, 0);
  }
  getsalesfromhp(): number {
    
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.salesfromhp || 0).reduce((acc, value) => acc + value, 0);
    //loadingref.close()
  }
  getsalesnotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.salesnotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  gettotalpurchasevalue(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.totalpurchasevalue || 0).reduce((acc, value) => acc + value, 0);
  }
  gettotalpurchasevaluefromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.totalpurchasevaluefromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  gettotalpurchasevaluenotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.totalpurchasevaluenotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getinitialpayment(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.initialpayment || 0).reduce((acc, value) => acc + value, 0);
  }
  getinitialpaymentfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.initialpaymentfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getinitialpaymentnotfromhp(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.initialpaymentnotfromhp || 0).reduce((acc, value) => acc + value, 0);
  }
  getamountSpend(): number {
    if ( !this.tableData.length) {
      return 0;
    } 
    this.data = this.dataSource.data;
    return (this.data).map(date => this.outputTableStructure[date]?.amountSpend || 0).reduce((acc, value) => acc + value, 0);
  }

  ngAfterViewInit() {
   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.tableData).sort();

    // this.dataSourcehp.paginator = this.Paginatorhp;
    // this.dataSourcehp.sort = this.hpSort;
    // this.dataSourcehp.data = (this.tableData).sort();

    // this.dataSourcelyl.paginator = this.Paginatorlyl;
    // this.dataSourcelyl.sort = this.lylSort;
    // this.dataSourcelyl.data = (this.tableData).sort();
  }

  ngOnDestroy(){
    this.entrySubscriptiion.unsubscribe()
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