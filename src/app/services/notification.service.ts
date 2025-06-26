import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notif = inject(MatSnackBar);

  show(message: string, type: 'info' | 'valid' | 'error' | 'warning' = 'info') {

    this.notif.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: type,
    });

  }
}
