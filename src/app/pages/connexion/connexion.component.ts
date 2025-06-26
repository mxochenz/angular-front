import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-connexion',
  imports: [MatButtonModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss',
})
export class ConnexionComponent {
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);
  notification = inject(NotificationService);

  formulaire = this.formBuilder.group({
    email: ['a@a', [Validators.email, Validators.required]],
    password: ['root', [Validators.required]],
  });

  onConnexion() {
    if (this.formulaire.valid) {
      this.http
        .post('http://localhost:5000/connexion', this.formulaire.value, {
          responseType: 'text',
        })
        .subscribe((jwt) => {
          this.auth.setJwt(jwt);
          this.notification.show('Vous êtes connecté', 'info');
          this.router.navigateByUrl('/accueil');
        });
    }
  }
}
