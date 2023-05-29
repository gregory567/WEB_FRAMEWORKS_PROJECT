import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json"})
  };

  title = 'Login Form';
  hidePassword: boolean = true;
  hideConfirm: boolean = true;
  loginSuccessful: boolean = false;
  loginFailed: boolean = false;
  loginErrorMessage: string = '';
  
  email = new FormControl('', [
    Validators.required, 
    Validators.email
  ]);

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(20),
  ]);

  confirmPassword = new FormControl('', [
    Validators.required,
    this.matchConfirmPassword.bind(this),
  ]);

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }
    if (this.password.hasError('minlength')) {
      return 'Password must be at least 8 characters';
    }
    if (this.password.hasError('maxlength')) {
      return 'Password cannot exceed 20 characters';
    }
    return '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'You must confirm your password';
    }
    if (this.confirmPassword.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  matchConfirmPassword(control: FormControl) {
    const password = this.password.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(form: NgForm) {

    if (form.valid) {

      /*
      console.log(form.value.email);
      console.log(form.value.password);
      */

      const email = this.email.value;
      const password = this.password.value;

      console.log('Email:', email);
      console.log('Password:', password);
  
      const loginData = {
        username: email,
        password: password,
      };

      this.http
      .post<{ message: string, authToken: string }>("http://localhost:3000/login", loginData, this.httpOptions)
      .subscribe({
        next: (responseData) => {
          this.loginSuccessful = true;
          this.loginFailed = false;
          this.loginErrorMessage = '';
          console.log(responseData.message);

          // Save the auth token in local storage or a secure location
          localStorage.setItem('authToken', responseData.authToken);

          // Redirect to landing page upon successful login
          this.router.navigate(['/landing-page']);
        },
        error: (err) => {
          this.loginSuccessful = false;
          this.loginFailed = true;
          this.loginErrorMessage = err.error.message;
          console.log(err);
        }
      });
    }
  }
}
