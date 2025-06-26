import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { Page404Component } from './pages/page404/page404.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { EditionProduitComponent } from './pages/edition-produit/edition-produit.component';
import { RetardsComponent } from './pages/retards/retards.component';
import { FormationComponent } from './pages/formation/formation.component';
import { EditionRetardComponent } from './pages/edition-retard/edition-retard.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'retards', component: RetardsComponent },
  { path: 'ajout-retard', component: EditionRetardComponent },
  { path: 'modifier-retard/:id', component: EditionRetardComponent },
  { path: 'formation', component: FormationComponent },
  { path: 'ajout-produit', component: EditionProduitComponent },
  { path: 'modifier-produit/:id', component: EditionProduitComponent },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];
