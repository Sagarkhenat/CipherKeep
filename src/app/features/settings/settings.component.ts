import { Component, inject } from '@angular/core';
import { AlertController, ToastController,NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { keyOutline, trashOutline, shieldCheckmarkOutline,helpCircleOutline } from 'ionicons/icons';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonListHeader, IonIcon, IonLabel, ModalController
} from '@ionic/angular/standalone';


import { AuthService,SecureStorageService } from 'src/providers/providers';
import { OnboardingComponent } from '../onboarding/onboarding.component';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports:[IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonListHeader,IonIcon,IonLabel]
})
export class SettingsComponent {

  constructor(private alertController: AlertController, private toastController: ToastController, private authService: AuthService,
    private navCtrl:NavController, private secureStorage:SecureStorageService,private modalCtrl: ModalController) {
    // We are adding the trash icon early so it is ready for the "Full Wipe" step
    addIcons({ keyOutline, trashOutline, shieldCheckmarkOutline,helpCircleOutline });
  }

  async openUserGuide() {
    const modal = await this.modalCtrl.create({
      component: OnboardingComponent
    });
    await modal.present();
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
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  async triggerFullWipe() {
    const alert = await this.alertController.create({
      header: 'CONFIRM FULL WIPE',
      message: 'This will permanently delete all saved secrets and your fallback PIN. This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'DELETE EVERYTHING',
          role: 'destructive',
          handler: () => this.executeNuke()
        }
      ]
    });
    await alert.present();
  }


  private async executeNuke() {
    try {
      // 1. Clear encrypted secrets from Keystore/Keychain
      await this.secureStorage.clearAllSecrets();

      // 2. Clear the fallback PIN and local preferences
      await this.authService.clearCredentials();

      // 3. Reset the global Signal state and kick user to LockScreen
      this.authService.logout();
      this.navCtrl.navigateRoot('/lock-screen');

      this.showToast('All data has been wiped successfully.', 'success');

    } catch (error) {

      this.showToast('Wipe failed. Please try again.', 'danger');

    }
  }

}
