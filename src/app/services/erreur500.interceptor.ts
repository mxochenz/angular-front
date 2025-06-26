import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { NotificationService } from './notification.service';

export const erreur500Interceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((erreur) => {
      if (erreur.status === 500) {
        notification.show(
          'Une erreur inconnue est survenur veuillez contacter votre administrateur',
          'error'
        );
      } else if (erreur.status === 0) {
        notification.show(
          'Impossible de contacter le serveur, veuillez vérifier votre connexion internet',
          'error'
        );
      }

      throw erreur;
    })
  );
};
