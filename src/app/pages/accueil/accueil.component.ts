import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  http = inject(HttpClient);
  trainings: Training[] = [];

  ngOnInit() {
    this.refreshTrainings();
  }

  refreshTrainings() {
    this.http
      .get<Training[]>('http://localhost:5000/training')
      .subscribe((training) => (this.trainings = training));
  }

  onClickSupprimer(training: Training) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.http
        .delete('http://localhost:5000/training/' + training.training_id)
        .subscribe((reponse) => this.refreshTrainings());
    }
  }
}
