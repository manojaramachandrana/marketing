import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-adcampaign',
  templateUrl: './adcampaign.component.html',
  styleUrls: ['./adcampaign.component.css']
})
export class AdcampaignComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getAdCampaigns();
  }

  getAdCampaigns() {
    const cutoffDate = new Date('2024-05-01');

    this.firestore.collection('adsinsight').get().subscribe((querySnapshot) => {
      const groupedData: {
        [key: string]: {
          campaigns: {
            [campaignName: string]: {
              adsets: {
                [adsetName: string]: {
                  ads: {
                    [adName: string]: any[]
                  }
                }
              }
            }
          },
          changes: {
            campaignChange: {
              added: { [campaignName: string]: any },
              missing: { [campaignName: string]: any }
            },
            adsetChange: {
              added: { [campaignName: string]: { [adsetName: string]: any } },
              missing: { [campaignName: string]: { [adsetName: string]: any } }
            },
            adChange: {
              added: { [campaignName: string]: { [adsetName: string]: { [adName: string]: any } } },
              missing: { [campaignName: string]: { [adsetName: string]: { [adName: string]: any } } }
            }
          }
        }
      } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docDate = data['docdate'];

        if (docDate && data['campaignname'] && data['adsetname'] && data['adname']) {
          const dateObj = docDate.toDate();

          if (dateObj > cutoffDate) {
            const dateString = dateObj.toISOString().split('T')[0];

            if (!groupedData[dateString]) {
              groupedData[dateString] = {
                campaigns: {},
                changes: {
                  campaignChange: { added: {}, missing: {} },
                  adsetChange: { added: {}, missing: {} },
                  adChange: { added: {}, missing: {} }
                }
              };
            }

            const campaignName = data['campaignname'];
            const adsetName = data['adsetname'];
            const adName = data['adname'];

            const currentDateGroup = groupedData[dateString];

            if (!currentDateGroup.campaigns[campaignName]) {
              currentDateGroup.campaigns[campaignName] = { adsets: {} };
            }

            if (!currentDateGroup.campaigns[campaignName].adsets[adsetName]) {
              currentDateGroup.campaigns[campaignName].adsets[adsetName] = { ads: {} };
            }

            if (!currentDateGroup.campaigns[campaignName].adsets[adsetName].ads[adName]) {
              currentDateGroup.campaigns[campaignName].adsets[adsetName].ads[adName] = [];
            }

            currentDateGroup.campaigns[campaignName].adsets[adsetName].ads[adName].push(data);
          }
        }
      });

      const dateKeys = Object.keys(groupedData).sort();
      let lastCampaigns = {};

      for (let i = 0; i < dateKeys.length; i++) {
        const currentDate = dateKeys[i];
        const currentCampaigns = groupedData[currentDate].campaigns;
        const currentChanges = groupedData[currentDate].changes;

        let hasChanges = false;

        for (const campaignName in lastCampaigns) {
          if (!currentCampaigns[campaignName]) {
            currentChanges.campaignChange.missing[campaignName] = JSON.parse(JSON.stringify(lastCampaigns[campaignName]));
            hasChanges = true;
          }
        }

        for (const campaignName in currentCampaigns) {
          if (!lastCampaigns[campaignName]) {
            currentChanges.campaignChange.added[campaignName] = JSON.parse(JSON.stringify(currentCampaigns[campaignName]));
            hasChanges = true;
          }
        }

        if (!hasChanges) {
          for (const campaignName in lastCampaigns) {
            if (!currentCampaigns[campaignName]) {
              currentCampaigns[campaignName] = JSON.parse(JSON.stringify(lastCampaigns[campaignName]));
            } else {
              const currentAdsets = currentCampaigns[campaignName].adsets;
              const lastAdsets = lastCampaigns[campaignName].adsets;

              for (const adsetName in lastAdsets) {
                if (!currentAdsets[adsetName]) {
                  currentAdsets[adsetName] = JSON.parse(JSON.stringify(lastAdsets[adsetName]));
                } else {
                  const currentAds = currentAdsets[adsetName].ads;
                  const lastAds = lastAdsets[adsetName].ads;

                  for (const adName in lastAds) {
                    if (!currentAds[adName]) {
                      currentAds[adName] = JSON.parse(JSON.stringify(lastAds[adName]));
                    } else {
                      lastAds[adName].forEach((lastAd, index) => {
                        if (currentAds[adName][index]) {
                          currentAds[adName][index].amountSpend  = currentAds[adName][index].amountSpend + (lastAd.amountSpend || 0);
                        } else {
                          currentAds[adName][index] = JSON.parse(JSON.stringify(lastAd));
                        }
                      });
                    }
                  }
                }
              }
            }
          }

          groupedData[currentDate].campaigns = currentCampaigns;

          delete groupedData[currentDate];
        }

        lastCampaigns = JSON.parse(JSON.stringify(currentCampaigns));
      }

      Object.keys(groupedData).forEach(async (dateKey) => {
        await this.firestore.collection('metadata').doc(dateKey).set(groupedData[dateKey], { merge: true })
          .then(() => console.log(`Saved or updated data for date: ${dateKey}`))
          .catch((error) => console.error(`Error saving data for date ${dateKey}:`, error));
      });

      console.log('Filtered Grouped Data:', groupedData);
    });
  }
}
 