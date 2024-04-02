import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: '',
  };
  loginError: any;

  constructor( private auth: AuthService) { }

  ngOnInit(): void {
  }
  passwordHidden = true;

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      this.auth.login(this.user.email, this.user.password)
        .then(() => {
        })
        .catch((error) => {
          console.error('Error during login:', error);
          this.loginError = 'Invalid email or password.';
        });
    }
  }

  // forgotPassword() {
  //   this.auth.forgotPassword(this.user.email)
  //     .then(() => {
  //       console.log('Password reset email sent successfully.');
  //     })
  //     .catch((error) => {
  //       console.error('Error sending password reset email:', error);
  //     });
  // }

  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }

}
