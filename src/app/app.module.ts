import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { A11yModule} from '@angular/cdk/a11y';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FbgaComponent } from './platform/fbga/fbga.component';
import { FbDataComponent } from './facebook/fb-data/fb-data.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './service/data.service';
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
import { DocComponent } from './doc/doc.component';
import { GptComponent } from './gpt/gpt.component';
import { SeasonalcamComponent } from './seasonalcam/seasonalcam.component';
import { SalesdialogComponent } from './salesdialog/salesdialog.component';
import { SalesconvComponent } from './salesconv/salesconv.component';
import { ConversionDialogComponent } from './conversion-dialog/conversion-dialog.component';
import { LeadsconvComponent } from './leadsconv/leadsconv.component';
import { LeadconvDialogComponent } from './leadconv-dialog/leadconv-dialog.component';
import { CampaignanalyticsComponent } from './campaignanalytics/campaignanalytics.component';
import { CampaignanalyticsDialogComponent } from './campaignanalytics-dialog/campaignanalytics-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FbgaComponent,
    FbDataComponent,
    FacebookDataComponent,
    FbadsdataComponent,
    LeaddialogComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    NorthstarComponent,
    DashboarddialogComponent,
    SampleComponent,
    SpinnerComponent,
    DocComponent,
    GptComponent,
    SeasonalcamComponent,
    SalesdialogComponent,
    SalesconvComponent,
    ConversionDialogComponent,
    LeadsconvComponent,
    LeadconvDialogComponent,
    CampaignanalyticsComponent,
    CampaignanalyticsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    A11yModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  providers: [
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
