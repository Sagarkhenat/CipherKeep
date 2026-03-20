import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, fingerPrintOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/auth.service';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon]
})
export class LockScreenComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  // State for the Error State UI placeholder
  biometricError = false;

  constructor() {
    // In standalone Ionic, icons must be registered explicitly
    addIcons({ lockClosedOutline, fingerPrintOutline });
  }

  async unlockVault() {
    console.log('Mocking biometric unlock success...');

    try {
      // 1. Check what biometric hardware is actually available on the device
      const info = await BiometricAuth.checkBiometry();

      console.log('Biometric info obtained from the device ::::', info);

      if (info.isAvailable) {
        // 2. Trigger the native OS prompt
        await BiometricAuth.authenticate({
          reason: 'Authenticate to access your vault',
          cancelTitle: 'Cancel',
          iosFallbackTitle: 'Use PIN'
        });

        // 3. If the promise resolves, authentication was successful
        this.authService.unlock();
        this.router.navigate(['/tabs/vault']);
      } else {
        // Hardware is missing or disabled
        this.biometricError = true;
      }

    }catch (err) {
      // User canceled, failed too many times, or denied permissions
      console.error('Biometric authentication failed:', err);
      this.biometricError = true;
    }
  }

  async useFallbackPin() {
    console.log('Fallback PIN triggered');
    // We will wire up the Error State logic here later

    const hasPin = await this.authService.hasPinSet();
    if (!hasPin) {
      await this.presentPinSetup();
    } else {
      await this.presentPinEntry();
    }
  }

  async presentPinSetup() {
    const alert = await this.alertController.create({
      header: 'Set Fallback PIN',
      message: 'Create a 4-digit PIN for when biometrics are unavailable.',
      inputs: [
        { name: 'pin', type: 'password', placeholder: 'Enter PIN', attributes: { maxlength: 4 } }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save & Unlock',
          handler: async (data) => {
            if (data.pin && data.pin.length === 4) {
              await this.authService.setPin(data.pin);
              this.authService.unlock();
              this.router.navigate(['/tabs/vault']);
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async presentPinEntry() {
    const alert = await this.alertController.create({
      header: 'Enter PIN',
      inputs: [
        { name: 'pin', type: 'password', placeholder: 'Enter your 4-digit PIN', attributes: { maxlength: 4 } }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Unlock',
          handler: async (data) => {
            const isValid = await this.authService.verifyPin(data.pin);
            if (isValid) {
              this.authService.unlock();
              this.router.navigate(['/tabs/vault']);
            } else {
              console.error('Invalid PIN entered');
              // Optionally present a toast notification here for invalid attempts
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
  }
}
