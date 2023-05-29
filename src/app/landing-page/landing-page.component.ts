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

  constructor(private router: Router, private http: HttpClient) { }

  postHighscore() {
    const highscoreData = {
      username: this.username,
      score: this.newHighscore
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Retrieve token from local storage
    });

    this.http.post('http://localhost:3000/highscores', highscoreData, { headers: headers })
      .subscribe({
        next: () => {
          // Handle success response
          console.log('Highscore submitted successfully.');
        },
        error: (err) => {
          // Handle error response
          console.error('Error submitting highscore:', err);
        }
      });
  }

  requestHighscoreList() {
    // Redirect to highscores page 
    this.router.navigate(['/highscores']);
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Retrieve token from local storage
    });

    this.http.post('http://localhost:3000/logout', null, { headers: headers })
      .subscribe({
        next: () => {
          // Handle success response
          console.log('Logged out successfully.');
          // Redirect to the login page or perform any required cleanup
        },
        error: (err) => {
          // Handle error response
          console.error('Error logging out:', err);
        }
      });
  }
}
