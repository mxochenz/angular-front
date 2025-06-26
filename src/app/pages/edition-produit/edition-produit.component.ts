import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
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
  formulaire = this.formBuilder.group(
    {
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.maxLength(255)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    },
    { validators: this.dateRangeValidator() }
  );

  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get('start_date')?.value;
      const endDate = control.get('end_date')?.value;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
          return { dateRange: true };
        }
      }
      return null;
    };
  }

  selectedFile: File | null = null;
  trainingEdite?: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parametres) => {
      if (parametres['id'] !== undefined) {
        this.http
          .get<any>('http://localhost:5000/training/' + parametres['id'])
          .subscribe((training) => {
            this.trainingEdite = training;
            this.formulaire.patchValue({
              ...training,
              start_date: training.start_date
                ? training.start_date.substring(0, 10)
                : '',
              end_date: training.end_date
                ? training.end_date.substring(0, 10)
                : '',
            });
          });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérification du type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.notification.show(
          'Type de fichier non autorisé (JPEG, PNG, GIF seulement)',
          'error'
        );
        input.value = '';
        return;
      }

      // Vérification de la taille (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        this.notification.show(
          'Le fichier est trop volumineux (max 2MB)',
          'error'
        );
        input.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  onClicValider() {
    if (this.formulaire.valid) {
      const formData = new FormData();

      // Ajouter TOUS les champs
      formData.append('title', this.formulaire.value.title!);
      formData.append('description', this.formulaire.value.description || '');
      formData.append('start_date', this.formulaire.value.start_date!);
      formData.append('end_date', this.formulaire.value.end_date!);

      // Toujours envoyer le chemin de l'image existante
      formData.append('existingImage', this.trainingEdite?.image || '');

      // Ajouter la nouvelle image si elle existe
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.trainingEdite) {
        this.http
          .put(
            'http://localhost:5000/training/' + this.trainingEdite.id,
            formData
          )
          .subscribe({
            next: () => {
              this.notification.show(
                'La formation a bien été modifiée',
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
        this.http.post('http://localhost:5000/training', formData).subscribe({
          next: () => {
            this.notification.show('La formation a bien été ajoutée', 'valid');
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
