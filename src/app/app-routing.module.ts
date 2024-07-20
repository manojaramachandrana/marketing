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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'fbga', component:FbgaComponent},
  { path: 'fb-data', component: FbDataComponent},
  { path: 'facebook-data', component: FacebookDataComponent}, 
  { path: 'fbadsdata', component: FbadsdataComponent},
  { path: 'leaddialog', component: LeaddialogComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'northstar', component: NorthstarComponent},
  { path: 'dashboarddialog', component: DashboarddialogComponent},
  { path: 'sample', component: SampleComponent},
  { path: 'spinner', component: SpinnerComponent},
  { path: 'doc', component: DocComponent},
  { path: 'gpt', component: GptComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
