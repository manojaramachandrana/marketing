import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { WebinaranalyticsDialogComponent } from '../webinaranalytics-dialog/webinaranalytics-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-webinaranalytics',
  templateUrl: './webinaranalytics.component.html',
  styleUrls: ['./webinaranalytics.component.css']
})
export class WebinaranalyticsComponent implements OnInit {
  dateRangeForm: FormGroup;

  eventData = {
    hplylregistration: {
      count: 0,
      leads: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      hplyl30minscount: 0,
      hplyl30minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      hplyl40minscount: 0,  
      hplyl40minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      hplyl60minscount: 0,  
      hplyl60minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>, 
      hplylappliedcount: 0,  
      hplylappliedlead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>, 
      hplylsalecount: 0,  
      hplylsalelead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
    },
    upregistration: {
      count: 0,
      leads: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      up30minscount: 0,
      up30minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      up40minscount: 0,   
      up40minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      up60minscount: 0, 
      up60minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      upappliedcount: 0, 
      upappliedlead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      upsalecount: 0, 
      upsalelead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
    },
    lylregistration: {
      count: 0,
      leads: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      lyl30minscount: 0,
      lyl30minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      lyl40minscount: 0,  
      lyl40minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
      lyl60minscount: 0,  
      lyl60minslead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>, 
      lylappliedcount: 0,  
      lylappliedlead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>, 
      lylsalecount: 0,  
      lylsalelead: [] as Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>,
    }
  };
  
  displayedColumns: string[] = ['event', 'count', '30mins','40mins','60mins', 'applied','sale'];
  dataSource: Array<{ event: string; count: number, duration30:number, duration40:number, duration60:number, applied:number,sale:number,salelead,duration30lead,duration40lead, duration60lead, appliedlead, countlead }> = [];

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, public dialog: MatDialog) {
    this.dateRangeForm = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {}

  onDateRangeChange(): void {
    const { start, end } = this.dateRangeForm.value;

    if (start && end) {
      console.log('start',start,'end',end)
      console.log(`Selected Date Range: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`);

      const startTimestamp = firebase.firestore.Timestamp.fromDate(start);
      const endTimestamp = firebase.firestore.Timestamp.fromDate(end);
      console.log('timestamp', startTimestamp,endTimestamp)

      this.fetchEventData('lylregistration', startTimestamp, endTimestamp);
      this.fetchEventData('upregistration', startTimestamp, endTimestamp);
      this.fetchData( startTimestamp, endTimestamp);
    } else {
      console.log('Please select a complete date range.');
    }
  }

  fetchData(start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {

    const enddate = end.toDate();
    enddate.setDate(enddate.getDate() + 1);
    const adjustedenddate = firebase.firestore.Timestamp.fromDate(enddate);
    this.firestore
      .collection('entries', ref =>
        ref
          .where('createddate', '>=', start)
          .where('createddate', '<=', adjustedenddate)
      )
      .valueChanges()
      .subscribe((data: any[]) => {
        console.log(`hplylregistration Data:`, data);
  
        const uniqueData = this.removeDuplicates(data, 'email');

        this.eventData['hplylregistration'].count = uniqueData.length;
        this.eventData['hplylregistration'].leads = uniqueData.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.createddate.toDate(),
          url: item.url
        }));
  
        this.checkhpLyl30minWatch(uniqueData, start, end);
        this.checkhpLyl40minWatch(uniqueData, start, end);
        this.checkhpLyl60minWatch(uniqueData, start, end);
        this.checkhpLylapplied(uniqueData, start, end);
        this.checkhpLylsale(uniqueData, start, end);
  
        this.updateDataSource();
      });
  }
  fetchEventData(eventName: string, start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    this.firestore
      .collection('lylregistration', ref =>
        ref
          .where('entrydata', '>=', start)
          .where('entrydata', '<=', end)
          .where('event', '==', eventName)
      )
      .valueChanges()
      .subscribe((data: any[]) => {
        console.log(`${eventName} Data:`, data);

        const uniqueData = this.removeDuplicates(data, 'email');
  
        this.eventData[eventName].count = uniqueData.length;
        this.eventData[eventName].leads = uniqueData.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydata.toDate(),
          url: item.url
        }));
  
        if (eventName === 'lylregistration') {
          this.checkLyl30minWatch(uniqueData, start, end);
          this.checkLyl40minWatch(uniqueData, start, end);
          this.checkLyl60minWatch(uniqueData, start, end);
          this.checkLylapplied(uniqueData, start, end);
          this.checkLylsale(uniqueData, start, end);
        }
  
        if (eventName === 'upregistration') {
          this.checkUp30minsAttended(uniqueData, start, end);
          this.checkUp40minsAttended(uniqueData, start, end);
          this.checkUp60minsAttended(uniqueData, start, end);
          this.checkUpapplied(uniqueData, start, end);
          this.checkUpsale(uniqueData, start, end);
        }
  
        this.updateDataSource();
      });
  }
  

  checkhpLyl30minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());

    this.firestore
      .collection('lylweb30minswatch', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        // console.log('LYL 30 Mins Watch Data:', watchData);

        let matchedLeads = watchData.filter(watchItem => emailList.includes(watchItem.email.trim()));
        // console.log('Matched Leads for LYL 30 mins:', matchedLeads);

        // console.log(matchedLeads.length)

       matchedLeads = this.removeDuplicates(matchedLeads, 'email');


        this.eventData.hplylregistration.hplyl30minscount = matchedLeads.length;
        // console.log('fgh',this.eventData.lylregistration.lyl30minscount)
        this.eventData.hplylregistration.hplyl30minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource();
      });
  }

  checkhpLyl40minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylwebinarattended', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end) 
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        // console.log('LYL 40 Mins Attended Data:', attendedData);
  
        let matchedLeads = attendedData.filter(attendedItem => emailList.includes(attendedItem.email.trim()));
        // console.log('Matched Leads for LYL 40 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.hplylregistration.hplyl40minscount = matchedLeads.length;
        this.eventData.hplylregistration.hplyl40minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource();  
      });
  }

  checkhpLyl60minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylwebcompletewatch', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        // console.log('LYL 60 Mins Watch Data:', watchData);
  
        let matchedLeads = watchData.filter(watchItem => emailList.includes(watchItem.email.trim()));
        // console.log('Matched Leads for LYL 60 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.hplylregistration.hplyl60minscount = matchedLeads.length;
        this.eventData.hplylregistration.hplyl60minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
  
        this.updateDataSource();
      });
  }

  checkhpLylapplied(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylapplied', ref =>
        ref.where('entrydate', '>=', start)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        let matchedLeads = watchData.filter(watchItem =>
          emailList.includes(watchItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead, 
            url: matchedData ? matchedData.url : lead.url 
          };
        });
  
        this.eventData.hplylregistration.hplylappliedcount = matchedLeads.length;
  
        this.eventData.hplylregistration.hplylappliedlead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
  
        this.updateDataSource();
      });
  }
  
  checkhpLylsale(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('leads', ref =>
        ref.where('converteddate', '>=', start)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        let matchedLeads = watchData.filter(watchItem =>
          emailList.includes(watchItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead, 
            url: matchedData ? matchedData.url : lead.url 
          };
        });
  
        this.eventData.hplylregistration.hplylsalecount = matchedLeads.length;
  
        this.eventData.hplylregistration.hplylsalelead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.mobile,
          entrydata: item.converteddate.toDate(),
          url: item.url,
          product: item.journeyname
        }));
  
        this.updateDataSource();
      });
  }
  
  checkLyl30minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());

    this.firestore
      .collection('lylweb30minswatch', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        // console.log('LYL 30 Mins Watch Data:', watchData);

        let matchedLeads = watchData.filter(watchItem => emailList.includes(watchItem.email.trim()));
        // console.log('Matched Leads for LYL 30 mins:', matchedLeads);

        // console.log(matchedLeads.length)
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

        this.eventData.lylregistration.lyl30minscount = matchedLeads.length;
        // console.log('fgh',this.eventData.lylregistration.lyl30minscount)
        this.eventData.lylregistration.lyl30minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource();
      });
  }

  checkUp30minsAttended(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
    //console.log(emailList)

    this.firestore
      .collection('upattendedduration', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end)
          .where('event', '==', 'upattended30mins')
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        // console.log('Up! 30 Mins Attended Data:', attendedData);

        let matchedLeads = attendedData.filter(attendedItem => emailList.includes(attendedItem.email.trim()));
        // console.log('Matched Leads for Up! 30 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

        this.eventData.upregistration.up30minscount = matchedLeads.length;
        this.eventData.upregistration.up30minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource();
      });
  }

  checkLyl40minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylwebinarattended', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end) 
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        // console.log('LYL 40 Mins Attended Data:', attendedData);
  
        let matchedLeads = attendedData.filter(attendedItem => emailList.includes(attendedItem.email.trim()));
        // console.log('Matched Leads for LYL 40 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.lylregistration.lyl40minscount = matchedLeads.length;
        this.eventData.lylregistration.lyl40minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource();  
      });
  }
  
  checkUp40minsAttended(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('upattendedduration', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end) 
          .where('event', '==', 'upattended40mins') 
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        // console.log('Up! 40 Mins Attended Data:', attendedData);
  
        let matchedLeads = attendedData.filter(attendedItem => emailList.includes(attendedItem.email.trim()));
        // console.log('Matched Leads for Up! 40 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.upregistration.up40minscount = matchedLeads.length;
        this.eventData.upregistration.up40minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource(); 
      });
  }

  checkLyl60minWatch(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylwebcompletewatch', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        // console.log('LYL 60 Mins Watch Data:', watchData);
  
        let matchedLeads = watchData.filter(watchItem => emailList.includes(watchItem.email.trim()));
        // console.log('Matched Leads for LYL 60 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.lylregistration.lyl60minscount = matchedLeads.length;
        this.eventData.lylregistration.lyl60minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
  
        this.updateDataSource();
      });
  }
  
  checkUp60minsAttended(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('upattendedduration', ref =>
        ref
          .where('entrydate', '>=', start)
          // .where('entrydate', '<=', end) 
          .where('event', '==', 'upattended60mins') 
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        // console.log('Up! 60 Mins Attended Data:', attendedData);
  
        let matchedLeads = attendedData.filter(attendedItem => emailList.includes(attendedItem.email.trim()));
        // console.log('Matched Leads for Up! 60 mins:', matchedLeads);

        matchedLeads = this.removeDuplicates(matchedLeads, 'email');

  
        this.eventData.upregistration.up60minscount = matchedLeads.length;
        this.eventData.upregistration.up60minslead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
        this.updateDataSource(); 
      });
  }

  removeDuplicates(data: any[], key: string): any[] {
    const unique = new Map();
    data.forEach(item => {
      if (!unique.has(item[key])) {
        unique.set(item[key], item);
      }
    });
    return Array.from(unique.values());
  }
  

  checkLylapplied(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('lylapplied', ref =>
        ref.where('entrydate', '>=', start)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        let matchedLeads = watchData.filter(watchItem =>
          emailList.includes(watchItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead, 
            url: matchedData ? matchedData.url : lead.url
          };
        });
  
        this.eventData.lylregistration.lylappliedcount = matchedLeads.length;
  
        this.eventData.lylregistration.lylappliedlead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
  
        this.updateDataSource();
      });
  }
  
  checkUpapplied(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('upapplied', ref =>
        ref.where('entrydate', '>=', start)
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        let matchedLeads = attendedData.filter(attendedItem =>
          emailList.includes(attendedItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead, 
            url: matchedData ? matchedData.url : lead.url 
          };
        });
  
        this.eventData.upregistration.upappliedcount = matchedLeads.length;
  
        this.eventData.upregistration.upappliedlead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          entrydata: item.entrydate.toDate(),
          url: item.url
        }));
  
        this.updateDataSource();
      });
  }
  

  checkLylsale(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    this.firestore
      .collection('leads', ref =>
        ref.where('converteddate', '>=', start)
      )
      .valueChanges()
      .subscribe((watchData: any[]) => {
        let matchedLeads = watchData.filter(watchItem =>
          emailList.includes(watchItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead,
            url: matchedData ? matchedData.url : lead.url 
          };
        });
  
        this.eventData.lylregistration.lylsalecount = matchedLeads.length;
  
        this.eventData.lylregistration.lylsalelead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.mobile,
          entrydata: item.converteddate.toDate(),
          url: item.url,
          product: item.journeyname
        }));
  
        this.updateDataSource();
      });
  }
  
  
  checkUpsale(data: any[], start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp): void {
    const emailList = data.map(item => item.email.trim());
  
    data.forEach(item => {
      console.log('Email:', item.email.trim(), 'URL:', item.url);
    });
  
    this.firestore
      .collection('leads', ref =>
        ref.where('converteddate', '>=', start)
      )
      .valueChanges()
      .subscribe((attendedData: any[]) => {
        let matchedLeads = attendedData.filter(attendedItem =>
          emailList.includes(attendedItem.email.trim())
        );
  
        matchedLeads = this.removeDuplicates(matchedLeads, 'email');
  
        matchedLeads = matchedLeads.map(lead => {
          const matchedData = data.find(dataItem => dataItem.email.trim() === lead.email.trim());
          return {
            ...lead, 
            url: matchedData ? matchedData.url : lead.url
          };
        });
  
        this.eventData.upregistration.upsalecount = matchedLeads.length;
  
        this.eventData.upregistration.upsalelead = matchedLeads.map(item => ({
          name: item.name,
          email: item.email,
          phone: item.mobile,
          entrydata: item.converteddate.toDate(),
          url: item.url,
          product: item.journeyname
        }));
  
        this.updateDataSource();
      });
  }
  

  openLeadDialog(duration: string, row: any): void {
    let leads: Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>;
  
    switch (duration) {
      case 'lead':
        leads = row.countlead;
        break;
      case '30mins':
        leads = row.duration30lead;
        break;
      case '40mins':
        leads = row.duration40lead;
        break;
      case '60mins':
        leads = row.duration60lead;
        break;
      case 'applied':
        leads = row.appliedlead;
        break;
      case 'sale':
        leads = row.salelead;
        break;
      default:
        leads = [];
    }
  
    this.dialog.open(WebinaranalyticsDialogComponent, {
      data: { leads, duration }
    });
  }
  
  updateDataSource(): void {
    this.dataSource = [
      {
        event: 'LYL Evergreen',
        count: this.eventData.lylregistration.count,
        duration30: this.eventData.lylregistration.lyl30minscount,
        duration40: this.eventData.lylregistration.lyl40minscount,
        duration60: this.eventData.lylregistration.lyl60minscount, 
        applied: this.eventData.lylregistration.lylappliedcount, 
        sale: this.eventData.lylregistration.lylsalecount,
        countlead: this.eventData.lylregistration.leads,
        duration30lead: this.eventData.lylregistration.lyl30minslead,
        duration40lead: this.eventData.lylregistration.lyl40minslead,
        duration60lead: this.eventData.lylregistration.lyl60minslead, 
        appliedlead: this.eventData.lylregistration.lylappliedlead,
        salelead: this.eventData.lylregistration.lylsalelead, 
      },
      {
        event: 'HomePage - LYL EWebinar',
        count: this.eventData.hplylregistration.count,
        duration30: this.eventData.hplylregistration.hplyl30minscount,
        duration40: this.eventData.hplylregistration.hplyl40minscount,
        duration60: this.eventData.hplylregistration.hplyl60minscount, 
        applied: this.eventData.hplylregistration.hplylappliedcount, 
        sale: this.eventData.hplylregistration.hplylsalecount, 
        countlead: this.eventData.hplylregistration.leads,
        duration30lead: this.eventData.hplylregistration.hplyl30minslead,
        duration40lead: this.eventData.hplylregistration.hplyl40minslead,
        duration60lead: this.eventData.hplylregistration.hplyl60minslead, 
        appliedlead: this.eventData.hplylregistration.hplylappliedlead,
        salelead: this.eventData.hplylregistration.hplylsalelead, 
      },
      {
        event: 'uP! Webinar Engine',
        count: this.eventData.upregistration.count,
        duration30: this.eventData.upregistration.up30minscount,
        duration40: this.eventData.upregistration.up40minscount, 
        duration60: this.eventData.upregistration.up60minscount,
        applied: this.eventData.upregistration.upappliedcount,
        sale: this.eventData.upregistration.upsalecount,
        countlead: this.eventData.upregistration.leads,
        duration30lead: this.eventData.upregistration.up30minslead,
        duration40lead: this.eventData.upregistration.up40minslead, 
        duration60lead: this.eventData.upregistration.up60minslead,
        appliedlead: this.eventData.upregistration.upappliedlead,
        salelead: this.eventData.upregistration.upsalelead,
      }
    ];
  
    console.log('Updated Data Source:', this.dataSource);
  }
  
  
  
}
