import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface CampaignData {
  date: string;
  campaigns: { name: string; adaccount: string }[];
}

@Component({
  selector: 'app-adcampaigndialog',
  templateUrl: './adcampaigndialog.component.html',
  styleUrls: ['./adcampaigndialog.component.css']
})
export class AdcampaigndialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CampaignData) {}
}
