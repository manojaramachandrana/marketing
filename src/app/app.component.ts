import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'analytics-screen';
  displayLogin: boolean = true;
  displayRegister: boolean = false;
  displayResetPassword: boolean = false;
  pageTitle: string = ''; 

  constructor(private router: Router, private authService: AuthService,private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateDisplayFlags();
    });
  }
  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      this.pageTitle = route.snapshot.data.title || route.snapshot.routeConfig?.path;
      if (this.pageTitle === 'dashboard'){
        this.pageTitle = 'Growth Metrics';
      } else if ( this.pageTitle === 'fb-data'){
        this.pageTitle = 'Ads Campaign Sets'
      } else if ( this.pageTitle === 'sample'){
        this.pageTitle = 'Daily Leads & Sales'
      } else if ( this.pageTitle === 'salesconv'){
        this.pageTitle = ' Sales Conversion Cycle'
      } else if ( this.pageTitle === 'northstar'){
        this.pageTitle = ' MarkTech North Star'
      } else if ( this.pageTitle === 'seasonalcampaign'){
        this.pageTitle = ' Seasonal Campaign'
      } else if ( this.pageTitle === 'leadsconv'){
        this.pageTitle = ' LYL Registration Data'
      }  else if ( this.pageTitle === 'combinedleads'){
        this.pageTitle = ' Webinar Analytics'
      } else if ( this.pageTitle === 'campaignanalytics'){
        this.pageTitle = ' Campaign Metric'
      }
      else {
        this.pageTitle = ''
      }
    });
  }


  shouldDisplayToolbar(): boolean {
    const currentRoute = this.router.url;
  
    switch (currentRoute) {
      case '/register':
      case '/login':
      case '/reset-password':
        return false;
      default:
        return true;
    }
  }

  updateDisplayFlags(): void {
    const currentRoute = this.router.url;

    switch (currentRoute) {
      case '/register':
        this.displayLogin = false;
        this.displayRegister = true;
        this.displayResetPassword = false;
        break;
      case '/login':
        this.displayLogin = true;
        this.displayRegister = false;
        this.displayResetPassword = false;
        break;
      case '/reset-password':
        this.displayLogin = false;
        this.displayRegister = false;
        this.displayResetPassword = true;
        break;
      default:
        this.displayLogin = true;
        this.displayRegister = false;
        this.displayResetPassword = false;
        break;
    }
  }

  refreshPage() {
    this.router.navigate(['/fbadsdata']);
    setTimeout(
      function(){ 
      location.reload(); 
      }, 100);
    //window.location.reload();
  }

  getUserName(): string {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.name : '';
  }
}
