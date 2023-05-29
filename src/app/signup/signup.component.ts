import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json"})
  };

  title = 'Signup Formular';
  hidePassword: boolean = true;
  hideConfirm: boolean = true;
  signupSuccessful: boolean = false;
  signupFailed: boolean = false;
  
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

  address = new FormControl('');

  postalCodeFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
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

  getPostalCodeErrorMessage() {
    if (this.postalCodeFormControl.hasError('required')) {
      return 'Postal code is required';
    }
    if (this.postalCodeFormControl.hasError('pattern')) {
      return 'Postal code must contain only numbers';
    }
    return '';
  }

  onSubmit(form: NgForm) {

    this.http.post<{message: string}>("http://localhost:3000/signup", form.value, this.httpOptions)
      // read more about this functionality at http://angular.io/guide/observables
      .subscribe({
        next: (responseData) => {
          console.log(responseData.message);
        },
        error: (err) => {
          console.log(err);
        }
      });

    this.signupSuccessful = false;
    this.signupFailed = false;

    if (form.valid) {
      console.log(form.valid);
      console.log('Email:', this.email.value);
      console.log('Password:', this.password.value);
      console.log('Confirm Password:', this.confirmPassword.value);

      if (this.email.value === 'test@test.at' && this.password.value === '12345678' && this.confirmPassword.value === '12345678') {
        this.signupSuccessful = true;
        this.signupFailed = false;
      } else {
        this.signupSuccessful = false;
        this.signupFailed = true;
      }

    }
  }


}
