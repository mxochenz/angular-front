import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-retards',
  imports: [MatCardModule, MatButtonModule, RouterLink, DatePipe],
  templateUrl: './retards.component.html',
  styleUrl: './retards.component.scss',
})
export class RetardsComponent {
  http = inject(HttpClient);
  retards: Retards[] = [];

  ngOnInit() {
    this.refreshRetards();
  }

  refreshRetards() {
    this.http
      .get<Retards[]>('http://localhost:5000/retard')
      .subscribe((retard) => (this.retards = retard));
  }

  onClickSupprimer(retard: Retards) {
    if (confirm('Voulez-vous vraiment supprimer ce retard ?')) {
      this.http
        .delete('http://localhost:5000/retard/' + retard.id)
        .subscribe((reponse) => this.refreshRetards());
    }
  }
}
