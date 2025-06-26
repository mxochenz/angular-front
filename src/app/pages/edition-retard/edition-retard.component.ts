import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Ajouté
import { AuthService } from '../../services/auth.service';
import { UserService, Stagiaire } from '../../services/user.service';

@Component({
  selector: 'app-edition-retard',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule, // Ajouté
  ],
  templateUrl: './edition-retard.component.html',
  styleUrl: './edition-retard.component.scss',
})
export class EditionRetardComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  http = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  // Formulaire avec types corrects
  formulaire = this.formBuilder.group({
    date_lateness: ['', [Validators.required]],
    duration: [0, [Validators.required, Validators.min(1)]],
    user_id: [0, [Validators.required]], // Changé en number
  });

  stagiaires: Stagiaire[] = []; // Typé avec l'interface
  retardEdite?: any;

  loading = true;
  ngOnInit() {
    this.userService.getStagiaires().subscribe({
      next: (stagiaires: Stagiaire[]) => {
        this.stagiaires = stagiaires;
        this.loading = false;
        // ... reste du code
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
    this.activatedRoute.params.subscribe((parametres) => {
      if (parametres['id']) {
        this.http
          .get<any>(`http://localhost:5000/retard/${parametres['id']}`)
          .subscribe((retard) => {
            this.retardEdite = retard;
            this.formulaire.patchValue({
              date_lateness: retard.date_lateness.substring(0, 10),
              duration: retard.duration,
              user_id: retard.user_id, // Maintenant compatible (number)
            });
          });
      }
    });

    // Charger la liste des stagiaires
    this.userService.getStagiaires().subscribe((stagiaires: Stagiaire[]) => {
      this.stagiaires = stagiaires;

      // Si utilisateur est stagiaire, pré-remplir et désactiver
      if (this.authService.getUserRole() === 'stagiaire') {
        const userId = this.authService.getUserId();
        if (userId) {
          this.formulaire.patchValue({ user_id: userId });
          this.formulaire.get('user_id')?.disable();
        }
      }
    });
  }

  onClicValider() {
    console.log('Stagiaires:', this.stagiaires);

    // Désactiver le bouton pendant le traitement
    if (this.loading) return;
    // Réactiver temporairement le champ pour la validation
    if (this.formulaire.get('user_id')?.disabled) {
      this.formulaire.get('user_id')?.enable();
    }

    if (this.formulaire.valid) {
      const formData = this.formulaire.value;
      console.log('ID sélectionné:', formData.user_id);
      // Convertir en nombre si nécessaire
      const userId = Number(formData.user_id);
      console.log("Type de l'ID:", typeof formData.user_id);

      // Vérification que c'est un stagiaire
      // Vérification que c'est un stagiaire
      const selectedUser = this.stagiaires.find((s) => s.id === userId);
      console.log('Utilisateur trouvé:', selectedUser);

      if (!selectedUser) {
        alert('Aucun stagiaire sélectionné');
        return;
      }

      if (!selectedUser || selectedUser.role_id !== 3) {
        alert('Seuls les stagiaires peuvent avoir des retards');
        return;
      }

      if (this.retardEdite) {
        this.http
          .put(`http://localhost:5000/retard/${this.retardEdite.id}`, formData)
          .subscribe(() => this.router.navigate(['/retards']));
      } else {
        this.http
          .post('http://localhost:5000/retard', formData)
          .subscribe(() => this.router.navigate(['/retards']));
      }
    }

    // Remettre en disabled si nécessaire
    if (this.authService.getUserRole() === 'stagiaire') {
      this.formulaire.get('user_id')?.disable();
    }
  }
}
