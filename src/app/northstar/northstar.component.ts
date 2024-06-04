import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-northstar',
  templateUrl: './northstar.component.html',
  styleUrls: ['./northstar.component.css']
})
export class NorthstarComponent implements OnInit {
  //totalspend30: number = 367785;

   totalAmountSpent: number = 0;
   totalAmountSpent30: number = 0;
   totalReturn30: number = 0;
  //totalAmountSpent: number = 0;
  totalReturn: number = 0;
  finalResult: number = 0;
  finalResult30: number = 0;
  today = new Date();
  last30day = new Date(this.today).setDate(this.today.getDate() - 30);
  last31day = new Date(this.today).setDate(this.today.getDate() - 31);
  last60day = new Date(this.today).setDate(this.today.getDate() - 60);
  last61day = new Date(this.today).setDate(this.today.getDate() - 61);
  last90day = new Date(this.today).setDate(this.today.getDate() - 90);


  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.fetchTotalSpendInLast30Days();
    //this.fetchTotalSpendInLast60Days();
    //this.fetchTotalSpendInLast90Days();
  }

  fetchTotalSpendInLast30Days(): void {
    const last30daysDate = this.getLast30DaysDate();

    this.firestore.collection('adsinsight', ref =>
      ref.where('docdate', '>=', firebase.firestore.Timestamp.fromDate(last30daysDate))
    ).valueChanges().pipe(
      map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.amountSpend, 0))
    ).subscribe(amount => {
      this.totalAmountSpent = amount;
      console.log('Total Spend:', this.totalAmountSpent);
      this.fetchTotalReturnInLast30Days();
    });
  }

  fetchTotalReturnInLast30Days(): void {
    const last30daysDate = this.getLast30DaysDate();

    this.firestore.collection('leads', ref =>
      ref.where('converteddate', '>=', firebase.firestore.Timestamp.fromDate(last30daysDate))
    ).valueChanges().pipe(
      map((leads: any[]) => leads.reduce((sum, lead) => sum + lead.totalpurchasevalue, 0))
    ).subscribe(amount => {
      this.totalReturn = amount;
      console.log('Total Return:', this.totalReturn);
      this.calculateFinalResult();
    });
  }

  getLast30DaysDate(): Date {
    const today = new Date();
    today.setDate(today.getDate() - 30);
    return today;
  }

  calculateFinalResult(): void {
    if (this.totalAmountSpent > 0 && this.totalReturn > 0) {
      const part = (this.totalAmountSpent/ 100000);
      const part1 = (this.totalAmountSpent/ 100000) / 20;
      //const part3 = (this.totalReturn / 100000);
      const part2 = (this.totalReturn / 100000) / part;
      const adjustment = Math.max(0, (20 - part) * 2);
      const intermediateResult = part2 - adjustment;
      this.finalResult = Number((part1 * intermediateResult).toFixed(1));

      console.log('Final Result:', this.finalResult);
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

  // fetchTotalSpendInLast60Days(): void {
  //   const last60daysDate = this.getLast60DaysDate();
  //   const last31daysDate = this.getLast31DaysDate();

  //   this.firestore.collection('adsinsight', ref =>
  //     ref
  //   .where('docdate', '>=', firebase.firestore.Timestamp.fromDate(last60daysDate))
  //   .where('docdate', '<=', firebase.firestore.Timestamp.fromDate(last31daysDate))
  //   ).valueChanges().pipe(
  //     map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.amountSpend, 0))
  //   ).subscribe(amount => {
  //     this.totalAmountSpent30 = amount;
  //     console.log('Total Spend30:', this.totalAmountSpent30);
  //     this.fetchTotalReturnInLast60Days();
  //   });
  // }

  // fetchTotalReturnInLast60Days(): void {
  //   const last60daysDate = this.getLast60DaysDate();
  //   const last31daysDate = this.getLast31DaysDate();

  //   this.firestore.collection('leads', ref => ref
  //   .where('converteddate', '>=', firebase.firestore.Timestamp.fromDate(last60daysDate))
  //   .where('converteddate', '<=', firebase.firestore.Timestamp.fromDate(last31daysDate))
  //   ).valueChanges().pipe(
  //     map((leads: any[]) => leads.reduce((sum, lead) => sum + lead.totalpurchasevalue, 0))
  //   ).subscribe(amount => {
  //     this.totalReturn30 = amount;
  //     console.log('Total Return30:', this.totalReturn30);
  //     this.calculateFinalResult60();
  //   });
  // }

  // getLast31DaysDate(): Date {
  //   const today = new Date();
  //   today.setDate(today.getDate() - 31);
  //   return today;
  // }

  // getLast60DaysDate(): Date {
  //   const today = new Date();
  //   today.setDate(today.getDate() - 60);
  //   return today;
  // }

  // calculateFinalResult60(): void {
  //   if (this.totalAmountSpent30 > 0 && this.totalReturn30 > 0) {
  //     const part = (this.totalAmountSpent30/ 100000);
  //     const part1 = (this.totalAmountSpent30/ 100000) / 20;
  //     //const part3 = (this.totalReturn / 100000);
  //     const part2 = (this.totalReturn30 / 100000) / part;
  //     const adjustment = Math.max(0, (20 - part) * 2);
  //     const intermediateResult = part2 - adjustment;
  //     this.finalResult = Number((part1 * intermediateResult).toFixed(1));

  //     console.log('Final Result30:', this.finalResult30);
  //   }
  // }

  // getFinalResultStatus60(finalResult: number): string {
  //   if (finalResult < 0) {
  //     return "HIGH ALERT WARNING";
  //   } else if (finalResult < 10) {
  //     return "Loss";
  //   } else if (finalResult <= 10) {
  //     return "Sustenance";
  //   } else if (finalResult <= 15) {
  //     return "Growth";
  //   } else if (finalResult <= 25) {
  //     return "Scale";
  //   } else {
  //     return "Unknown Status";
  //   }
  // }
  
  
}


// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
// import {  map } from 'rxjs/operators';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// @Component({
//   selector: 'app-northstar',
//   templateUrl: './northstar.component.html',
//   styleUrls: ['./northstar.component.css']
// })
// export class NorthstarComponent implements OnInit {
//   totalAmountSpent: number = 0;
//   totalreturn: number = 0;
//   finalResult: number = 0;

//   constructor(private firestore: AngularFirestore) { 
    
//   }

//   ngOnInit(): void {
//     this.totalspendinlast30days();
//   }
  
//   totalspendinlast30days(): void {
//     const todaydate  = new Date();
//     const last30dayago = new Date(todaydate);
//     last30dayago.setDate(todaydate.getDate() - 1);
//     console.log(last30dayago)

//     this.firestore.collection('adsinsight', ref =>
//       ref.where('docdate', '>=', firebase.firestore.Timestamp.fromDate(last30dayago))
//     ).valueChanges().pipe(
//       map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.amountSpend, 0))
//     ).subscribe(amount => {
//       this.totalAmountSpent = amount;
//       console.log('spend',this.totalAmountSpent)
//       this.calculateFinalResult()
//     });
//   }

//   calculateFinalResult(): void {
//     const totalAdSpent = this.totalAmountSpent;

//     const todaydate  = new Date();
//     const last30dayago = new Date(todaydate);
//     last30dayago.setDate(todaydate.getDate() - 1);

//     this.firestore.collection('leads', ref =>
//       ref.where('purchasedate', '>=', firebase.firestore.Timestamp.fromDate(last30dayago))
//     ).valueChanges().pipe(
//       map((ads: any[]) => ads.reduce((sum, ad) => sum + ad.totalpurchasevalue, 0))
//     ).subscribe(amount => {
//       this.totalreturn = amount;
//       console.log('spend',this.totalreturn)
//     });
//     const part = totalAdSpent / 100000;
//     const part1 = part / 20;
//     const part2 = this.totalreturn / totalAdSpent;
//     const adjustment = Math.max(0, (20 - totalAdSpent) * 2);
//     const intermediateResult = part2 - adjustment;
//     this.finalResult = part1 * intermediateResult;
//     console.log('smms',this.finalResult);
//   }
//   }
 