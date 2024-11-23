import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-webinaranalytics-dialog',
  templateUrl: './webinaranalytics-dialog.component.html',
  styleUrls: ['./webinaranalytics-dialog.component.css']
})
export class WebinaranalyticsDialogComponent {
  leads: Array<{ name: string; email: string; phone: string; entrydata: Date; url: string }>;
  duration: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.leads = this.getUniqueLeads(data.leads);
    this.duration = data.duration;
  }

  extractUTMParam(url: string, param: string): string | null {
    const regex = new RegExp('[?&]' + param + '=([^&]*)');
    const result = regex.exec(url);
    return result ? decodeURIComponent(result[1]) : null;
  }

  getUniqueLeads(leads: any[]) {
    const uniqueLeads = Array.from(new Map(leads.map(lead => [lead.email, lead])).values());
    return uniqueLeads;
  }
}
