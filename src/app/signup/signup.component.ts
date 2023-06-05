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

  title = 'Signup Form';
  hidePassword = true;
  hideConfirm = true;
  signupSuccessful = false;
  signupFailed = false;
  signupErrorMessage: string = '';
  
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

  city = new FormControl('', [
    Validators.required
  ]);

  street = new FormControl('', [
    Validators.required
  ]);

  postalCodeFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
  ]);

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter an email';
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

    if (!password || !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getCityErrorMessage() {
    return this.city.hasError('required') ? 'City is required' : '';
  }

  getStreetErrorMessage() {
    return this.street.hasError('required') ? 'Street is required' : '';
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
    if (form.valid) {
      this.signupFailed = false;

      /*
      console.log(form.value.email);
      console.log(form.value.password);
      */

      const email = this.email.value;
      const password = this.password.value;
      const city = this.city.value;
      const street = this.street.value;
      const postalCode = this.postalCodeFormControl.value;

      console.log('Email:', email);
      console.log('Password:', password);

      const signupData = {
        username: email,
        password: password,
        city: city,
        street: street,
        postalCode: postalCode
      };
  
      this.http
      .post<{ message: string }>('http://localhost:3000/signup', signupData, this.httpOptions)
      .subscribe({
        next: (responseData) => {
          this.signupSuccessful = true;
          this.signupErrorMessage = '';
          console.log(responseData.message);
        },
        error: (err) => {
          this.signupSuccessful = false;
          this.signupFailed = true;
          this.signupErrorMessage = err.error.message;
          console.log(err);
        }
      });
    }
  } 
}
