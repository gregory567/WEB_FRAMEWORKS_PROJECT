import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent {
  username: string = '';
  newHighscore: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  postHighscore() {
    const highscoreData = {
      username: this.username,
      score: this.newHighscore
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAuthToken() // Retrieve token from local storage using a function
    });

    this.http.post<{ message: string }>('http://localhost:3000/highscores', highscoreData, { headers: headers })
      .subscribe({
        next: (response) => {
          // Handle success response
          console.log('Highscore submitted successfully.');
          this.successMessage = response.message;
          this.errorMessage = ''; // Clear any previous error message

          // Clear the input fields after successful input
          this.username = '';
          this.newHighscore = 0;
        },
        error: (err) => {
          // Handle error response
          console.error('Error submitting highscore:', err);
          this.errorMessage = err.error.message;
          this.successMessage = ''; // Clear any previous success message
        }
      });
  }

  requestHighscoreList() {
    // Redirect to highscores page 
    this.router.navigate(['/highscores']);
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAuthToken() // Retrieve token from local storage using a function
    });

    this.http.post<{ message: string }>('http://localhost:3000/logout', null, { headers: headers })
      .subscribe({
        next: (response) => {
          // Handle success response
          console.log('Logged out successfully.');
          this.successMessage = response.message;
          this.errorMessage = ''; // Clear any previous error message

          // Redirect to the login page or perform any required cleanup
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Handle error response
          console.error('Error logging out:', err);
          this.errorMessage = err.error.message;
          this.successMessage = ''; // Clear any previous success message
        }
      });
  }
}
