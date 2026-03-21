import { Component, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth/auth.service';
import { addIcons } from 'ionicons';
import { keyOutline, trashOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonListHeader,IonIcon,IonLabel} from '@ionic/angular/standalone';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports:[IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonListHeader,IonIcon,IonLabel]
})
export class SettingsComponent {
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private authService = inject(AuthService);

  constructor() {
    // We are adding the trash icon early so it is ready for the "Full Wipe" step
    addIcons({ keyOutline, trashOutline, shieldCheckmarkOutline });
  }

  async changePin() {
    const alert = await this.alertController.create({
      header: 'Update PIN',
      message: 'Enter your new 4-digit fallback PIN.',
      inputs: [
        {
          name: 'newPin',
          type: 'password',
          placeholder: 'New PIN',
          attributes: {
            inputmode: 'numeric',
            maxlength: 4,
          }
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.newPin && data.newPin.length >= 4) {
              // This calls the method you established in the AuthService
              await this.authService.savePin(data.newPin);
              this.showToast('PIN updated successfully!', 'success');

              return true;

            } else {
              this.showToast('Invalid PIN. Must be at least 4 digits.', 'danger');
              return false; // Prevents the alert from closing if validation fails
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
