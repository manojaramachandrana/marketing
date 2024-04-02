import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  user = {
    email: '',
  };
  resetError: any;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(resetForm: any) {
    if (resetForm.valid) {
      this.auth.forgotPassword(this.user.email)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error('Error sending password reset email:', error);
          this.resetError = 'Error sending password reset email. Please check your email address.';
        });
    }
  }
}
