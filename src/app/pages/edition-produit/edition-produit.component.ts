import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-edition-produit',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './edition-produit.component.html',
  styleUrl: './edition-produit.component.scss',
})
export class EditionProduitComponent {
  http = inject(HttpClient);
  notification = inject(NotificationService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  formBuilder = inject(FormBuilder);
  formulaire = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    description: ['', [Validators.maxLength(255)]],
  });

  trainingEdite?: Training;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parametres) => {
      //si c'est une édition (si il y a un id dans l'URL)
      console.log(parametres);

      if (parametres['id'] !== undefined) {
        this.http
          .get<any>('http://localhost:5000/training/' + parametres['id'])
          .subscribe((training) => {
            this.trainingEdite = training;
            this.formulaire.patchValue(training);
          });
      }
    });
  }

  onClicValider() {
    if (this.formulaire.valid) {
      //si il y a un id dans l'URL
      if (this.trainingEdite) {
        this.http
          .put(
            'http://localhost:5000/training/' + this.trainingEdite.training_id,
            this.formulaire.value
          )
          .subscribe({
            next: (reponse) => {
              this.notification.show(
                'La formation a bien été modifié',
                'valid'
              );
              this.router.navigateByUrl('/formation');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show(
                  'Impossible de modifier la formation, car une formation du même nom existe déjà',
                  'error'
                );
              }
            },
          });
      } else {
        this.http
          .post('http://localhost:5000/training', this.formulaire.value)
          .subscribe({
            next: (reponse) => {
              this.notification.show('La formation a bien été ajouté', 'valid');
              this.router.navigateByUrl('/formation');
            },
            error: (erreur) => {
              if (erreur.status === 409) {
                this.notification.show(
                  "Impossible d'ajouter la formation, car une formation du même nom existe déjà",
                  'error'
                );
              }
            },
          });
      }
    }
  }
}
