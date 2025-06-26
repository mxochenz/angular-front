import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formation',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss',
})
export class FormationComponent {
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
