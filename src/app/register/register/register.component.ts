import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  passwordHidden = true;
  confirmPasswordHidden = true;
  registerForm: FormGroup;
  passwordLengthError: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.emailValidator]],
      phone: ['',[Validators.required,Validators.pattern(/^\d{10}$/), ],],
      password: ['',[Validators.required, Validators.minLength(8)],],
      confirmPassword: ['', Validators.required],
    },{ validator: this.passwordsMatch.bind(this) });
  }

  emailValidator(control: { value: string; }) {
    console.log('Email validator called with value:', control.value);
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (control.value && !emailPattern.test(control.value)) {
      console.log('Email validation failed');
      return { invalidEmail: true };
    }
  
    console.log('Email validation passed');
    return null;
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {}

  async onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted:', form);

      try {
        await this.auth.register(this.user);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    } else {
      console.log('Form fields empty or invalid');
    }
  }

  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordHidden = !this.confirmPasswordHidden;
  }

  validatePassword() {
  }
}
