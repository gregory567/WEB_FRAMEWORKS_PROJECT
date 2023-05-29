import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})

export class HighscoresComponent {
  highscores: any[] | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Access the highscores passed from the landing page
    this.highscores = this.route.snapshot.data['highscores'];
    console.log('Highscore list:', this.highscores);
    // Display the highscore list in the highscores component
  }
}

