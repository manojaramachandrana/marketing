import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as CanvasJS from 'canvasjs';

interface Lead {
  totalpurchasevalue?: number;
  purchasedate?: { _seconds: number; _nanoseconds: number }; 
}

interface Spend {
  amountSpend?: number;
  docdate
}

@Component({
  selector: 'app-adsanalytics',
  templateUrl: './adsanalytics.component.html',
  styleUrls: ['./adsanalytics.component.css']
})
export class AdsanalyticsComponent implements OnInit {

  
  // data = {
  //   'Pipeline Strength (last 7 days)': '',
  //   'Ad Spend (last 20 days)': 0,
  //   'Sale Value (last 20 days)': 0,
  //   'Return on Adspend (last 20 days)': '',
  //   'Ad Spend (last 30 days)': 0,
  //   'Sale Value (last 30 days)': 0,
  //   'Return on Adspend (last 30 days)': '',
  //   'Current Month Sale Value': 0,
  //   'Last 7 Days Sale Value': 0,
  //   'Yesterday Adspend': 0,
  //   'Sale Value From Nov 10': 0
  // };

  data = {
    'Pipeline Strength (last 7 days)': [],
    'Ad Spend (last 20 days)': [],
    'Sale Value (last 20 days)': [],
    'Return on Adspend (last 20 days)': [],
    'Ad Spend (last 30 days)': [],
    'Sale Value (last 30 days)': [],
    'Return on Adspend (last 30 days)': [],
    'Current Month Sale Value': [],
    'Last 7 Days Sale Value': [],
    'Yesterday Adspend': [],
    'Sale Value From Nov 10': []
  };

  // dataforselecteddate = {
  //   'Pipeline Strength (last 7 days)': '',
  //   'Ad Spend (last 20 days)': 0,
  //   'Sale Value (last 20 days)': 0,
  //   'Return on Adspend (last 20 days)': '',
  //   'Ad Spend (last 30 days)': 0,
  //   'Sale Value (last 30 days)': 0,
  //   'Return on Adspend (last 30 days)': '',
  //   'Current Month Sale Value': 0,
  //   'Last 7 Days Sale Value': 0,
  //   'Yesterday Adspend': 0,
  //   'Sale Value From Nov 10': 0
  // };

  public isNumber(value: any): boolean {
    return !isNaN(value) && typeof value === 'number';
  }

  selectedDate: Date  

  displayedColumns: string[] = ['parameter', 'value'];
  dataSource = [];
  dateRange: string[] = [];
  // dataSourceForSelectedDate = []; 
  
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.countLeadsLast7Days();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.countLeadsLast7Days();
  }

  async countLeadsLast7Days() {   
//     const currentDate = new Date(2024,10,30);
//     currentDate.setHours(23, 59, 59, 999);
// currentDate.setDate(currentDate.getDate() - 40);
// console.log(currentDate); 
// const twentyDaysAgo = new Date();
// twentyDaysAgo.setDate(currentDate.getDate() - 21);
//     console.log('twenty',twentyDaysAgo)

    for (let i = 1; i < 8; i++) {
    const currentDate =  new Date();
    currentDate.setDate(currentDate.getDate() - i);
    currentDate.setHours(23, 59, 59, 999);
    console.log('current',currentDate)
    const sevenDaysAgo = new Date(currentDate);
    const twentyDaysAgo = new Date(currentDate);
    const thirtyDaysAgo = new Date(currentDate);
    const subtwentyDaysAgo = new Date(currentDate);
    const subthirtyDaysAgo = new Date(currentDate);
    const nov10Date = new Date(2024, 10, 10); 
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);
    console.log('seven',sevenDaysAgo)
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 21);
    console.log('twenty',twentyDaysAgo)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
    console.log('thirty',thirtyDaysAgo)
    subtwentyDaysAgo.setDate(subtwentyDaysAgo.getDate() - 20);
    console.log('subtwenty',subtwentyDaysAgo)
    subthirtyDaysAgo.setDate(subthirtyDaysAgo.getDate() - 30);
    console.log('subthirty',subthirtyDaysAgo)
    const startOfDate = new Date(currentDate);
    startOfDate.setHours(0, 0, 0, 0); 
    startOfDate.setDate(startOfDate.getDate() + 1);
    const subcurrentdate = new Date(currentDate);
    subcurrentdate.setDate(subcurrentdate.getDate() + 1);
    console.log(subcurrentdate,startOfDate,currentDate)
    // console.log(subtwentyDaysAgo,twentyDaysAgo,'twenty')
    // console.log(subthirtyDaysAgo,thirtyDaysAgo,'thirty')

    try {
      const entriesSnapshot = await this.firestore.collection('entries', ref => 
        ref.where('createddate', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
           .where('createddate', '<=', firebase.firestore.Timestamp.fromDate(currentDate))
      ).get().toPromise();
      const entriesCount = entriesSnapshot?.size || 0;

      const lylRegistrationSnapshot = await this.firestore.collection('lylregistration', ref => 
        ref.where('entrydata', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
           .where('entrydata', '<=', firebase.firestore.Timestamp.fromDate(currentDate))
      ).get().toPromise();
      const lylregistrationCount = lylRegistrationSnapshot?.size || 0;

      // this.leads = entriesCount + lylregistrationCount;
      // console.log('Total Leads:', this.leads);

      const leadsSnapshot = await this.firestore.collection('leads').get().toPromise();

      let totalPurchaseValue = 0;
      let totalPurchaseValue20 = 0;
      let totalPurchaseValue30 = 0;
      let totalPurchaseValueNov10 = 0;
      let totalPurchaseValueCurrentMonth = 0;
      
      //purchasevalue   
      leadsSnapshot?.forEach(doc => {
        const data = doc.data() as Lead;

        if (data.purchasedate && data.purchasedate._seconds !== undefined) {
          const purchasedate = new firebase.firestore.Timestamp(
            data.purchasedate._seconds,
            data.purchasedate._nanoseconds
          );

          const purchaseDate = purchasedate.toDate();

          if (purchaseDate >= sevenDaysAgo && purchaseDate <= currentDate) {
            totalPurchaseValue += data.totalpurchasevalue || 0; 
          }
          if (purchaseDate >= twentyDaysAgo && purchaseDate <= currentDate) {
            totalPurchaseValue20 += data.totalpurchasevalue || 0;
          }
          if (purchaseDate >= thirtyDaysAgo && purchaseDate <= currentDate) {
            totalPurchaseValue30 += data.totalpurchasevalue || 0;
          }
          if (purchaseDate >= nov10Date && purchaseDate <= currentDate) {
            totalPurchaseValueNov10 += data.totalpurchasevalue || 0;
          }
          if (purchaseDate >= startOfMonth && purchaseDate <= currentDate) {
            totalPurchaseValueCurrentMonth += data.totalpurchasevalue || 0;
          }
        }
      });

      // this.sale7 = totalPurchaseValue;
      // this.sale20 = totalPurchaseValue20;
      // this.sale30 = totalPurchaseValue30;
      // this.salenov10 = totalPurchaseValueNov10;
      // this.salecurrentmonth = totalPurchaseValueCurrentMonth;

      // console.log('Total Purchase Value (Last 7 Days):', this.sale7, this.sale20, this.sale30, this.salenov10, this.salecurrentmonth)

            //spendvalue   
            const adsinsightsSnapshot = await this.firestore.collection('adsinsight', ref => 
              ref.where('docdate', '>=', firebase.firestore.Timestamp.fromDate(thirtyDaysAgo))
                .where('docdate', '<=', firebase.firestore.Timestamp.fromDate(subcurrentdate))
            ).get().toPromise();

            let totalspend20 = 0;
            let totalspend30 = 0;
            let totalspendyes =0;

            adsinsightsSnapshot?.forEach(doc => {
              const data = doc.data() as Spend;

              if (data.docdate) {
                const purchaseDate = data.docdate.toDate();

                if (purchaseDate >= subtwentyDaysAgo && purchaseDate <= subcurrentdate) {
                  totalspend20 += data.amountSpend || 0;
                }
                if (purchaseDate >= subthirtyDaysAgo && purchaseDate <= subcurrentdate) {
                  totalspend30 += data.amountSpend || 0;
                }
                if (purchaseDate >= currentDate && purchaseDate <= subcurrentdate) {
                  totalspendyes += data.amountSpend || 0;
                }
              }
            });

            // this.spend20 = Math.round(totalspend20);
            // this.spend30 = Math.round(totalspend30);
            // this.spendyes = Math.round(totalspendyes);

            // console.log(this.spend20, this.spend30, this.spendyes);

            this.data['Pipeline Strength (last 7 days)'].push(entriesCount + lylregistrationCount + '/144');
            this.data['Ad Spend (last 20 days)'].push(Math.round(totalspend20));
            this.data['Sale Value (last 20 days)'].push(totalPurchaseValue20);
            this.data['Return on Adspend (last 20 days)'].push(Math.round(totalPurchaseValue20 / Math.round(totalspend20)) + 'X');
            this.data['Ad Spend (last 30 days)'].push(Math.round(totalspend30));
            this.data['Sale Value (last 30 days)'].push(totalPurchaseValue30);
            this.data['Return on Adspend (last 30 days)'].push(Math.round(totalPurchaseValue30 / Math.round(totalspend30)) + 'X');
            this.data['Current Month Sale Value'].push(totalPurchaseValueCurrentMonth);
            this.data['Last 7 Days Sale Value'].push(totalPurchaseValue);
            this.data['Yesterday Adspend'].push(Math.round(totalspendyes));
            this.data['Sale Value From Nov 10'].push(totalPurchaseValueNov10);

            // this.data = {
            //   'Pipeline Strength (last 7 days)': entriesCount + lylregistrationCount + '/144',
            //   'Ad Spend (last 20 days)': Math.round(totalspend20),
            //   'Sale Value (last 20 days)': totalPurchaseValue20,
            // 'Return on Adspend (last 20 days)': Math.round(totalPurchaseValue20 / Math.round(totalspend20)) + 'X',
            //   'Ad Spend (last 30 days)': Math.round(totalspend30),
            //   'Sale Value (last 30 days)': totalPurchaseValue30,
            //   'Return on Adspend (last 30 days)': Math.round(totalPurchaseValue30/Math.round(totalspend30)) + 'X',
            //   'Current Month Sale Value': totalPurchaseValueCurrentMonth,
            //   'Last 7 Days Sale Value': totalPurchaseValue,
            //   'Yesterday Adspend': Math.round(totalspendyes),
            //   'Sale Value From Nov 10': totalPurchaseValueNov10
            // };

            this.dataSource = Object.keys(this.data).map(key => {
              return { parameter: key, value: this.data[key] };
            });

    console.log(this.data)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

  // async updateSelectedDateTable() {
  //   const currentDate = this.selectedDate;
  //   const sevenDaysAgo = new Date();
  //   const twentyDaysAgo = new Date();
  //   const thirtyDaysAgo = new Date();
  //   const subtwentyDaysAgo = new Date();
  //   const subthirtyDaysAgo = new Date();
  //   currentDate.setDate(currentDate.getDate() - 1);
  //   currentDate.setHours(23, 59, 59, 999);
  //   const nov10Date = new Date(2024, 10, 10); 
  //   const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //   sevenDaysAgo.setDate(currentDate.getDate() - 8);
  //   twentyDaysAgo.setDate(currentDate.getDate() - 21);
  //   thirtyDaysAgo.setDate(currentDate.getDate() - 31);
  //   subtwentyDaysAgo.setDate(currentDate.getDate() - 20);
  //   subthirtyDaysAgo.setDate(currentDate.getDate() - 30);
  //   const startOfDate = new Date(currentDate);
  //   startOfDate.setHours(0, 0, 0, 0); 
  //   startOfDate.setDate(startOfDate.getDate() + 1);
  //   const subcurrentdate = new Date();
  //   subcurrentdate.setDate(currentDate.getDate() + 1);
  //   console.log(subcurrentdate,startOfDate,currentDate)

  //   try {
  //     const entriesSnapshot = await this.firestore.collection('entries', ref => 
  //       ref.where('createddate', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
  //          .where('createddate', '<=', firebase.firestore.Timestamp.fromDate(currentDate))
  //     ).get().toPromise();
  //     const entriesCount = entriesSnapshot?.size || 0;

  //     const lylRegistrationSnapshot = await this.firestore.collection('lylregistration', ref => 
  //       ref.where('entrydata', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
  //          .where('entrydata', '<=', firebase.firestore.Timestamp.fromDate(currentDate))
  //     ).get().toPromise();
  //     const lylregistrationCount = lylRegistrationSnapshot?.size || 0;

  //     // this.leads = entriesCount + lylregistrationCount;
  //     // console.log('Total Leads:', this.leads);

  //     const leadsSnapshot = await this.firestore.collection('leads').get().toPromise();

  //     let totalPurchaseValue = 0;
  //     let totalPurchaseValue20 = 0;
  //     let totalPurchaseValue30 = 0;
  //     let totalPurchaseValueNov10 = 0;
  //     let totalPurchaseValueCurrentMonth = 0;

  //     //purchasevalue   
  //     leadsSnapshot?.forEach(doc => {
  //       const data = doc.data() as Lead;

  //       if (data.purchasedate && data.purchasedate._seconds !== undefined) {
  //         const purchasedate = new firebase.firestore.Timestamp(
  //           data.purchasedate._seconds,
  //           data.purchasedate._nanoseconds
  //         );

  //         const purchaseDate = purchasedate.toDate();

  //         if (purchaseDate >= sevenDaysAgo && purchaseDate <= currentDate) {
  //           totalPurchaseValue += data.totalpurchasevalue || 0; 
  //         }
  //         if (purchaseDate >= twentyDaysAgo && purchaseDate <= currentDate) {
  //           totalPurchaseValue20 += data.totalpurchasevalue || 0;
  //         }
  //         if (purchaseDate >= thirtyDaysAgo && purchaseDate <= currentDate) {
  //           totalPurchaseValue30 += data.totalpurchasevalue || 0;
  //         }
  //         if (purchaseDate >= nov10Date && purchaseDate <= currentDate) {
  //           totalPurchaseValueNov10 += data.totalpurchasevalue || 0;
  //         }
  //         if (purchaseDate >= startOfMonth && purchaseDate <= currentDate) {
  //           totalPurchaseValueCurrentMonth += data.totalpurchasevalue || 0;
  //         }
  //       }
  //     });

  //     // this.sale7 = totalPurchaseValue;
  //     // this.sale20 = totalPurchaseValue20;
  //     // this.sale30 = totalPurchaseValue30;
  //     // this.salenov10 = totalPurchaseValueNov10;
  //     // this.salecurrentmonth = totalPurchaseValueCurrentMonth;

  //     // console.log('Total Purchase Value (Last 7 Days):', this.sale7, this.sale20, this.sale30, this.salenov10, this.salecurrentmonth)

  //           //spendvalue   
  //           const adsinsightsSnapshot = await this.firestore.collection('adsinsight', ref => 
  //             ref.where('docdate', '>=', firebase.firestore.Timestamp.fromDate(thirtyDaysAgo))
  //               .where('docdate', '<=', firebase.firestore.Timestamp.fromDate(subcurrentdate))
  //           ).get().toPromise();

  //           let totalspend20 = 0;
  //           let totalspend30 = 0;
  //           let totalspendyes =0;

  //           adsinsightsSnapshot?.forEach(doc => {
  //             const data = doc.data() as Spend;

  //             if (data.docdate) {
  //               const purchaseDate = data.docdate.toDate();

  //               if (purchaseDate >= subtwentyDaysAgo && purchaseDate <= subcurrentdate) {
  //                 totalspend20 += data.amountSpend || 0;
  //               }
  //               if (purchaseDate >= subthirtyDaysAgo && purchaseDate <= subcurrentdate) {
  //                 totalspend30 += data.amountSpend || 0;
  //               }
  //               if (purchaseDate >= currentDate && purchaseDate <= subcurrentdate) {
  //                 totalspendyes += data.amountSpend || 0;
  //               }
  //             }
  //           });

  //           // this.spend20 = Math.round(totalspend20);
  //           // this.spend30 = Math.round(totalspend30);
  //           // this.spendyes = Math.round(totalspendyes);

  //           // console.log(this.spend20, this.spend30, this.spendyes);

  //           this.dataforselecteddate = {
  //             'Pipeline Strength (last 7 days)': entriesCount + lylregistrationCount + '/144',
  //             'Ad Spend (last 20 days)': Math.round(totalspend20),
  //             'Sale Value (last 20 days)': totalPurchaseValue20,
  //           'Return on Adspend (last 20 days)': Math.round(totalPurchaseValue20 / Math.round(totalspend20)) + 'X',
  //             'Ad Spend (last 30 days)': Math.round(totalspend30),
  //             'Sale Value (last 30 days)': totalPurchaseValue30,
  //             'Return on Adspend (last 30 days)': Math.round(totalPurchaseValue30/Math.round(totalspend30)) + 'X',
  //             'Current Month Sale Value': totalPurchaseValueCurrentMonth,
  //             'Last 7 Days Sale Value': totalPurchaseValue,
  //             'Yesterday Adspend': Math.round(totalspendyes),
  //             'Sale Value From Nov 10': totalPurchaseValueNov10
  //           };

  //           this.dataSourceForSelectedDate = Object.keys(this.dataforselecteddate).map(key => {
  //             return { parameter: key, value: this.dataforselecteddate[key] };
  //           });

  //   console.log(this.dataforselecteddate)

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

}
