import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FbgaComponent } from './platform/fbga/fbga.component';
import { FbDataComponent } from './facebook/fb-data/fb-data.component';
import { FacebookDataComponent } from './facebook/facebook-data/facebook-data.component';
import { FbadsdataComponent } from './fbadsdata/fbadsdata.component';
import { LeaddialogComponent } from './facebook/leaddialog/leaddialog.component';
import { LoginComponent } from './register/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { ResetPasswordComponent } from './register/reset-password/reset-password.component';
import { NorthstarComponent } from './northstar/northstar.component';
import { DashboarddialogComponent } from './dashboarddialog/dashboarddialog.component';
import { SampleComponent } from './sample/sample.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { GptComponent } from './gpt/gpt.component';
import { DocComponent } from './doc/doc.component';
import { SeasonalcamComponent } from './seasonalcam/seasonalcam.component';
import { SalesdialogComponent } from './salesdialog/salesdialog.component';
import { SalesconvComponent } from './salesconv/salesconv.component';
import { ConversionDialogComponent } from './conversion-dialog/conversion-dialog.component';
import { LeadsconvComponent } from './leadsconv/leadsconv.component';
import { CampaignanalyticsComponent } from './campaignanalytics/campaignanalytics.component';
import { CombinedleadsComponent } from './combinedleads/combinedleads.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'fbga', component:FbgaComponent , canActivate: [AuthGuard] },
  { path: 'fb-data', component: FbDataComponent , canActivate: [AuthGuard] },
  { path: 'facebook-data', component: FacebookDataComponent , canActivate: [AuthGuard] }, 
  { path: 'fbadsdata', component: FbadsdataComponent , canActivate: [AuthGuard] },
  { path: 'leaddialog', component: LeaddialogComponent , canActivate: [AuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent , canActivate: [AuthGuard] },
  { path: 'northstar', component: NorthstarComponent , canActivate: [AuthGuard] },
  { path: 'dashboarddialog', component: DashboarddialogComponent , canActivate: [AuthGuard] },
  { path: 'leadsandsales', component: SampleComponent , canActivate: [AuthGuard] },
  { path: 'spinner', component: SpinnerComponent , canActivate: [AuthGuard] },
  { path: 'doc', component: DocComponent , canActivate: [AuthGuard] },
  { path: 'gpt', component: GptComponent , canActivate: [AuthGuard] },
  { path: 'seasonalcampaign', component: SeasonalcamComponent , canActivate: [AuthGuard] },
  { path: 'salesdialog', component: SalesdialogComponent , canActivate: [AuthGuard] },
  { path: 'salesconv', component: SalesconvComponent , canActivate: [AuthGuard] },
  { path: 'conversiondialog', component: ConversionDialogComponent , canActivate: [AuthGuard] },
  { path: 'lylregistration', component: LeadsconvComponent , canActivate: [AuthGuard] },
  { path: 'campaignanalytics', component: CampaignanalyticsComponent , canActivate: [AuthGuard] },
  { path: 'webinaranalytics', component: CombinedleadsComponent , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
