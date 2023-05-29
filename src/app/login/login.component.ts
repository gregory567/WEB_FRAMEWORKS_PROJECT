import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json"})
  };

  title = 'Login Formular';
  hidePassword: boolean = true;
  hideConfirm: boolean = true;
  loginSuccessful: boolean = false;
  loginFailed: boolean = false;
  
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
      return 'Password cannot be more than 20 characters';
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

    this.http.post<{message: string}>("http://localhost:3000/login", form.value, this.httpOptions)
      // read more about this functionality at http://angular.io/guide/observables
      .subscribe({
        next: (responseData) => {
          console.log(responseData.message);
        },
        error: (err) => {
          console.log(err);
        }
      });


    this.loginSuccessful = false;
    this.loginFailed = false;

    if (form.valid) {
      console.log(form.valid);
      console.log('Email:', this.email.value);
      console.log('Password:', this.password.value);
      console.log('Confirm Password:', this.confirmPassword.value);

      if (this.email.value === 'test@test.at' && this.password.value === '12345678' && this.confirmPassword.value === '12345678') {
        this.loginSuccessful = true;
        this.loginFailed = false;
      } else {
        this.loginSuccessful = false;
        this.loginFailed = true;
      }

    }
  }


}
