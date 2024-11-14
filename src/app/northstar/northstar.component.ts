// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { combineLatest } from 'rxjs';
// import { map } from 'rxjs/operators';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// @Component({
//   selector: 'app-northstar',
//   templateUrl: './northstar.component.html',
//   styleUrls: ['./northstar.component.css']
// })
// export class NorthstarComponent implements OnInit {
//   totalAmountSpent: number = 0;
//   totalReturn: number = 0;
//   finalResult: number = 0;
  
//   today = new Date();
//   last30day = new Date(this.today).setDate(this.today.getDate() - 30);

//   constructor(private firestore: AngularFirestore) {}

//   ngOnInit(): void {
//     this.fetchDataInParallel();
//   }

//   fetchDataInParallel(): void {
//     const last30daysDate = this.getLast30DaysDate();

//     const spendQuery = this.firestore.collection('adsinsight', ref =>
//       ref.where('docdate', '>=', firebase.firestore.Timestamp.fromDate(last30daysDate))
//     ).valueChanges().pipe(
//       map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.amountSpend, 0))
//     );

//     const returnQuery = this.firestore.collection('leads', ref =>
//       ref.where('converteddate', '>=', firebase.firestore.Timestamp.fromDate(last30daysDate))
//     ).valueChanges().pipe(
//       map((leads: any[]) => leads.reduce((sum, lead) => sum + lead.totalpurchasevalue, 0))
//     );

//     combineLatest([spendQuery, returnQuery]).subscribe(([totalSpent, totalReturn]) => {
//       this.totalAmountSpent = totalSpent;
//       this.totalReturn = this.calculateReturnWithoutGST(totalReturn);
//       // console.log('Total Spend:', this.totalAmountSpent);
//       // console.log('Total Return (without GST):', this.totalReturn);
//       this.calculateFinalResult();
//     });
//   }

//   getLast30DaysDate(): Date {
//     return new Date(this.last30day); 
//   }

//   calculateReturnWithoutGST(totalReturn: number): number {
//     const gstRate = 0.18; // 18% GST
//     return totalReturn / (1 + gstRate);
//   }

//   calculateFinalResult(): void {
//     if (this.totalAmountSpent > 0 && this.totalReturn > 0) {
//       const part = this.totalAmountSpent / 100000;
//       const part1 = part / 20;
//       const part2 = (this.totalReturn / 100000) / part;
//       const adjustment = Math.max(0, (20 - part) * 2);
//       const intermediateResult = part2 - adjustment;
//       this.finalResult = Number((part1 * intermediateResult).toFixed(1));

//       // console.log('Final Result:', this.finalResult);
//     }
//   }

//   getFinalResultStatus(finalResult: number): string {
//     if (finalResult < 0) {
//       return "HIGH ALERT WARNING";
//     } else if (finalResult < 10) {
//       return "Loss";
//     } else if (finalResult <= 10) {
//       return "Sustenance";
//     } else if (finalResult <= 15) {
//       return "Growth";
//     } else if (finalResult <= 25) {
//       return "Scale";
//     } else {
//       return "Unknown Status";
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-northstar',
  templateUrl: './northstar.component.html',
  styleUrls: ['./northstar.component.css']
})
export class NorthstarComponent implements OnInit {
  totalAmountSpent: number = 0;
  totalReturn: number = 0;
  finalResult: number = 0;

  today = new Date();
  last30day = new Date(this.today.getTime() - 30 * 24 * 60 * 60 * 1000);
  startDate: Date = this.last30day;
  endDate: Date = this.today;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.fetchDataInRange();
  }

  fetchDataInRange(): void {
    const start = firebase.firestore.Timestamp.fromDate(this.startDate);

    const endDateWithOneDayAdded = new Date(this.endDate);
    endDateWithOneDayAdded.setDate(endDateWithOneDayAdded.getDate() + 1);
    const end = firebase.firestore.Timestamp.fromDate(endDateWithOneDayAdded);
    

    const spendQuery = this.firestore.collection('adsinsight', ref =>
      ref.where('docdate', '>=', start).where('docdate', '<=', end)
    ).valueChanges().pipe(
      map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.amountSpend, 0))
    );

    const returnQuery = this.firestore.collection('leads', ref =>
      ref.where('converteddate', '>=', start).where('converteddate', '<=', end)
    ).valueChanges().pipe(
      map((leads: any[]) => leads.reduce((sum, lead) => sum + lead.totalpurchasevalue, 0))
    );

    combineLatest([spendQuery, returnQuery]).subscribe(([totalSpent, totalReturn]) => {
      this.totalAmountSpent = totalSpent;
      this.totalReturn = this.calculateReturnWithoutGST(totalReturn);
      this.calculateFinalResult();
    });
  }

  calculateReturnWithoutGST(totalReturn: number): number {
    const gstRate = 0.18; 
    return totalReturn / (1 + gstRate);
  }

  calculateFinalResult(): void {
    if (this.totalAmountSpent > 0 && this.totalReturn > 0) {
      const part = this.totalAmountSpent / 100000;
      const part1 = part / 20;
      const part2 = (this.totalReturn / 100000) / part;
      const adjustment = Math.max(0, (20 - part) * 2);
      const intermediateResult = part2 - adjustment;
      this.finalResult = Number((part1 * intermediateResult).toFixed(1));
    }
  }

  getFinalResultStatus(finalResult: number): string {
    if (finalResult < 0) {
      return "HIGH ALERT WARNING";
    } else if (finalResult < 10) {
      return "Loss";
    } else if (finalResult <= 10) {
      return "Sustenance";
    } else if (finalResult <= 15) {
      return "Growth";
    } else if (finalResult <= 25) {
      return "Scale";
    } else {
      return "Unknown Status";
    }
  }

  onDateRangeChange(): void {
    this.fetchDataInRange();
  }
}
