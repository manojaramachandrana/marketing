import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AdcampaigndialogComponent } from '../adcampaigndialog/adcampaigndialog.component';

interface CampaignDocument {
  campaigns: { [key: string]: any };
}

interface CampaignData {
  date: string;
  campaigns: { name: string; adaccount: string }[];
}

@Component({
  selector: 'app-adcampaign',
  templateUrl: './adcampaign.component.html',
  styleUrls: ['./adcampaign.component.css']
})
export class AdcampaignComponent implements OnInit {
  allCampaignData: CampaignData[] = [];
  campaignData: CampaignData[] = [];
  selectedAdAccount: string = 'all'; 
  allowedAdAccounts = [
    'all',
    'google_ads',
    "picasso's_AdVentures",
    'Branding_Brilliance',
    'Magnetic_marketing',
    'Antano&Harini.com'
  ];
  displayedColumns: string[] = ['date', 'campaigns']; 

  constructor(private firestore: AngularFirestore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAdCampaigns();
  }

  onAdAccountChange(selectedAdAccount: string): void {
    this.selectedAdAccount = selectedAdAccount;
    this.applyFilter();  
  }

  async getAdCampaigns(): Promise<void> {
    try {
      const snapshot = await this.firestore
        .collection('metadata', ref => ref.orderBy('__name__', 'desc').limit(10))
        .get()
        .toPromise();

      this.allCampaignData = snapshot.docs.map(doc => {
        const date = doc.id;
        const data = doc.data() as CampaignDocument;
        const campaigns = data.campaigns || {};

        const campaignArray = Object.keys(campaigns).map(campaignName => {
          let adaccount = 'Unknown';
          const adsets = campaigns[campaignName].adsets || {};

          for (const adsetName in adsets) {
            const ads = adsets[adsetName].ads || {};

            for (const adKey in ads) {
              const adArray = ads[adKey];

              if (Array.isArray(adArray) && adArray.length > 0) {
                const firstAd = adArray[0];

                if (firstAd && firstAd.adaccount) {
                  adaccount = firstAd.adaccount;
                  break;
                }
              }
            }

            if (adaccount !== 'Unknown') {
              break;
            }
          }

          return { name: campaignName, adaccount };
        }).filter(campaign => campaign !== null);

        return { date, campaigns: campaignArray };
      });
      this.getoveralladcampaigns();

      this.applyFilter(); 
    } catch (error) {
      console.error("Error fetching ad campaigns: ", error);
    }
  }

  getPreviousDate(campaign: CampaignData): string {
    if (!campaign.date) {
      console.error("Campaign date is missing or invalid:", campaign);
      return 'Invalid date';
    }
  
    const currentIndex = this.allCampaignData.findIndex(c => c.date === campaign.date);
  
    if (currentIndex === -1) {
      console.error("Campaign not found in the allCampaignData array:", campaign);
      return 'Campaign not found';
    }
  
    const currentDate = new Date(campaign.date);
    if (isNaN(currentDate.getTime())) {
      console.error("Invalid date for campaign:", campaign);
      return 'Invalid date';
    }
  
    if (currentIndex > 0) {
      const previousCampaign = this.allCampaignData[currentIndex + 1];
  
      if (previousCampaign && previousCampaign.date) {
        const previousDate = new Date(previousCampaign.date);
        if (isNaN(previousDate.getTime())) {
          console.error("Invalid previous date:", previousCampaign);
          return 'Invalid previous date';
        }
  
        previousDate.setDate(previousDate.getDate() + 1);
        return this.formatDate(previousDate);
      } else {
        console.error("Previous campaign does not have a valid date:", previousCampaign);
        return this.formatDate(currentDate);
      }
    }
  
    return this.formatDate(currentDate);
  }
  
  applyFilter(): void {
    if (this.selectedAdAccount === 'all') {
      this.campaignData = [...this.allCampaignData]; 
    } else {
      this.campaignData = this.allCampaignData
        .map(item => ({
          ...item,
          campaigns: item.campaigns.filter(campaign => campaign.adaccount === this.selectedAdAccount)
        }))
        .filter(item => item.campaigns.length > 0);
    }
  }

  getoveralladcampaigns(): void {
    this.firestore.collection('metadata').snapshotChanges().subscribe(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.payload.doc.data();
        console.log(data );
      });
    }, error => {
      console.error("Error fetching ad campaigns: ", error);
    });
  }

  openDialog(campaign: CampaignData): void {
    this.dialog.open(AdcampaigndialogComponent, {
      width: '400px',
      data: campaign
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  formattedDate(getday: Date): string {
    const date = new Date(getday);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
}
 