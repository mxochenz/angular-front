import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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
  authService = inject(AuthService);

  retards: Retard[] = [];
  userRole: string = 'guest';

  ngOnInit() {
    this.refreshRetards();
    this.userRole = this.authService.getUserRole();
  }

  refreshRetards() {
    this.http
      .get<Retard[]>('http://localhost:5000/retard')
      .subscribe((retards) => (this.retards = retards));
  }

  onClickSupprimer(retard: Retard) {
    if (confirm('Voulez-vous vraiment supprimer ce retard ?')) {
      this.http
        .delete('http://localhost:5000/retard/' + retard.id)
        .subscribe(() => this.refreshRetards());
    }
  }
}
