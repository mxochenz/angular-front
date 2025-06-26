import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Eval Angular';
  auth = inject(AuthService);
  notification = inject(NotificationService);

  onClickDeconnexion() {
    this.auth.removeJwt();
    this.notification.show('Vous êtes deconnecté');
  }
}
