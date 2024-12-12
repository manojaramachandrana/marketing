import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ChangeDetectorRef } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

interface Lead {
  totalpurchasevalue?: number;
  purchasedate?: { _seconds: number; _nanoseconds: number }; 
}

interface Spend {
  amountSpend?: number;
  docdate
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors?: string[];
};

@Component({
  selector: 'app-adsanalytics',
  templateUrl: './adsanalytics.component.html',
  styleUrls: ['./adsanalytics.component.css']
})

export class AdsanalyticsComponent implements OnInit {

  showChart = false; 

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public linechart: Partial<ChartOptions>;
  public isChartReady: boolean = false; 

  data = {
    'Pipeline Strength (last 7 days)':[],
    'Ad Spend (last 20 days)': [],
    'Sale Value (last 20 days)':[],
    'Return on Adspend (last 20 days)': [],
    'Ad Spend (last 30 days)': [],
    'Sale Value (last 30 days)': [],
    'Return on Adspend (last 30 days)': [],
    'Current Month Sale Value':[],
    'Last 7 Days Sale Value': [],
    'Yesterday Adspend': [],
    'Sale Value From Nov 10': []
  };

  public isNumber(value: any): boolean {
    return !isNaN(value) && typeof value === 'number';
  }

  selectedDate: Date  ;
  headerDates: string[] = [];

  displayedColumns: string[] = ['parameter', 'day1','day2','day3','day4','day5','day6','day7'];
  dataSource = [];
  dateRange: string[] = [];
  
  constructor(private firestore: AngularFirestore, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.generateHeaderDates();
    this.countLeadsLast7Days();
    
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.countLeadsLast7Days();
  }

  onShowChartChange(event: any): void {
    if (this.showChart) {
      this.initializeChart(this.selectedspecification); 
    }
  }

  selectedspecification: string = 'all'; 
  allowedspecification = [
    'Ads Spend',
    'Return on AdsSpend',
    'Sale Value'
  ];


  onspecificationChange(selectedspecification: string): void {
    this.selectedspecification = selectedspecification || 'Sale Value'; 
      this.initializeChart(selectedspecification); 
    
  }

  initializeChart(selectedspecification) {

    if (!selectedspecification) {
      console.error("No specification selected for the chart.");
      return;
    }

    console.log(selectedspecification, 'derfdsfmsdjvndscn')

    let data20: number[] = [];
    let data30: number[] = [];
    let label: string = '';
  
    if (selectedspecification === 'Ads Spend') {
      console.log('yes')
      data20 = this.data['Ad Spend (last 20 days)']?.slice().reverse() || [];
      data30 = this.data['Ad Spend (last 30 days)']?.slice().reverse() || [];
      label = 'Ad Spend';
    } else if (selectedspecification === 'Return on AdsSpend') {
      console.log('yes12')

      data20 = this.data['Return on Adspend (last 20 days)']?.slice().reverse() || [];
      data30 = this.data['Return on Adspend (last 30 days)']?.slice().reverse() || [];
      label = 'Return on Adspend';
    } else {
      console.log('yeswettg')

      data20 = this.data['Sale Value (last 20 days)']?.slice().reverse() || [];
      data30 = this.data['Sale Value (last 30 days)']?.slice().reverse() || [];
      label = 'Sale Value';
    }
  
    const days = this.headerDates?.slice().reverse() || [];
  
    if (!data20.length || !data30.length || !days.length || data20.length <=5) {
      console.error("Data for the chart is not available or incomplete.");
      return;
    }
  
    this.chartOptions = {
      series: [
        {
          name: `${label} (last 20 days)`,
          data: data20,
        },
        {
          name: `${label} (last 30 days)`,
          data: data30,
        }
      ],
      chart: {
        type: "line",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      colors: ["#007bff", "#ffa500"], 
      xaxis: {
        categories: days,
        title: {
          text: "Days",
        },
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: label,
        },
        labels: {
          formatter: (value: number) => this.isNumber(value) ? this.formatCurrency(value) : value.toString(),
        },
      },
      dataLabels: {
        enabled: false, 
      },
      stroke: {
        curve: "smooth", 
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value: number) => this.isNumber(value) ? this.formatCurrency(value) : value.toString(),
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right", 
      },
    };
  
    this.isChartReady = true;
    this.cdr.detectChanges();
  }

  formatCurrency(value: number): string {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + " Cr"; 
    } else if (value >= 100000) {
      return (value / 100000).toFixed(2) + " Lakh";
    }
    return value.toLocaleString(); 
  }
  
  generateHeaderDates() {
    const today = new Date();
    this.headerDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index); 
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); 
    });
  }

  async countLeadsLast7Days() {   

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
    console.log('startmonth',startOfMonth)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    console.log('seven',sevenDaysAgo)
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    console.log('twenty',twentyDaysAgo)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log('thirty',thirtyDaysAgo)
    subtwentyDaysAgo.setDate(subtwentyDaysAgo.getDate() - 19);
    console.log('subtwenty',subtwentyDaysAgo)
    subthirtyDaysAgo.setDate(subthirtyDaysAgo.getDate() - 29);
    console.log('subthirty',subthirtyDaysAgo)
    const startOfDate = new Date(currentDate);
    startOfDate.setHours(0, 0, 0, 0); 
    startOfDate.setDate(startOfDate.getDate() + 1);
    console.log('current',startOfDate)
    const subcurrentdate = new Date(currentDate);
    subcurrentdate.setDate(subcurrentdate.getDate() + 1);
    console.log(subcurrentdate,startOfDate,currentDate)

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

          let purchaseDate = purchasedate.toDate();
          purchaseDate = new Date(purchaseDate.getTime() + (5 * 60 + 30) * 60 * 1000);

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

            this.data['Pipeline Strength (last 7 days)'].push(entriesCount + '/144');
            this.data['Ad Spend (last 20 days)'].push(Math.round(totalspend20));
            this.data['Sale Value (last 20 days)'].push((totalPurchaseValue20 /1.18 ) );
            this.data['Return on Adspend (last 20 days)'].push((((totalPurchaseValue20 /1.18) / totalspend20).toFixed(1)) + 'X');
            this.data['Ad Spend (last 30 days)'].push(Math.round(totalspend30));
            this.data['Sale Value (last 30 days)'].push((totalPurchaseValue30 / 1.18 ) );
            this.data['Return on Adspend (last 30 days)'].push((((totalPurchaseValue30 /1.18) / totalspend30).toFixed(1)) + 'X');
            this.data['Current Month Sale Value'].push(totalPurchaseValueCurrentMonth /1.18);
            this.data['Last 7 Days Sale Value'].push(totalPurchaseValue /1.18);
            this.data['Yesterday Adspend'].push(Math.round(totalspendyes));
            this.data['Sale Value From Nov 10'].push(totalPurchaseValueNov10 /1.18);

            this.dataSource = Object.keys(this.data).map(key => {
              return { parameter: key, value: this.data[key] };
            });

    console.log(this.data)
    
    // this.initializeChart()
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
 
}

}
