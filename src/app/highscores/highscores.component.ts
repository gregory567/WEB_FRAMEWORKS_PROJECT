import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})

export class HighscoresComponent implements OnInit {
  highscores: any[] | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.requestHighscoreList();
  }

  requestHighscoreList() {
    // Get the authentication token from local storage
    const authToken = localStorage.getItem('authToken');

    // Set the headers with the authentication token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Make the HTTP GET request to retrieve the highscores
    this.http.get('http://localhost:3000/highscores', { headers })
    .subscribe({
    next: (highscores: any) => {
        this.highscores = highscores;
        console.log('Highscore list:', this.highscores);
      },
    error: (err) => {
        console.error('Error retrieving highscores:', err);
      }
    });
  }
}
