import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'analytics-screen';
  displayLogin: boolean = true;
  displayRegister: boolean = false;
  displayResetPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateDisplayFlags();
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

  getUserName(): string {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.name : '';
  }
}
