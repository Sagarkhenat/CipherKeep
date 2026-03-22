import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';
//import { SecureStorageService } from 'src/app/core/storage/secure-storage.service';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
          IonIcon, IonContent, IonList, IonItem, IonLabel, IonSearchbar,ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';

import { AuthService,SecureStorageService } from 'src/providers/providers';
import { OnboardingComponent } from '../onboarding/onboarding.component';
@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
  standalone: true,
  imports: [IonSearchbar, CommonModule,IonHeader, IonToolbar, IonTitle,
          IonButtons, IonButton,IonIcon, IonContent, IonList, IonItem, IonLabel]
})
export class VaultComponent implements OnInit {
  // Initialize the signal with an empty array
  secrets: Array<{ key: string, value: string }> = [];

  // Standard string to hold the search text
  searchQuery: string = '';

  // A getter that dynamically filters the array based on the search query
  get filteredSecrets() {
    if (!this.searchQuery) {
      return this.secrets;
    }
    const query = this.searchQuery.toLowerCase();
    return this.secrets.filter(secret =>
      secret.key.toLowerCase().includes(query)
    );
  }

  constructor(
    private secureStorage: SecureStorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {

    addIcons({ addOutline, trashOutline });
  }

  async ngOnInit() {
    const firstRun = await this.authService.isFirstRun();
    if (firstRun) {
      this.presentUserGuide();
    } else {

    }

    this.loadSecrets();
  }

  async presentUserGuide() {
    const modal = await this.modalCtrl.create({
      component: OnboardingComponent,
      breakpoints: [0, 1], // Full screen or swipeable
      initialBreakpoint: 1
    });

    await modal.present();

    // Mark as seen once they close it
    await modal.onDidDismiss();
    await this.authService.markGuideAsSeen();
  }


  async loadSecrets() {
    try {
      // 1. Retrieve all stored keys from the native keystore
      const { value: keys } = await SecureStoragePlugin.keys();
      this.secrets = [];

      // 2. Attempt to decrypt each value
      for (const key of keys) {
        const secretValue = await this.secureStorage.getSecret(key);

        if (secretValue !== null) {
          console.log('Updated value of secret keys to be loaded at vault page :::', key, secretValue);
          this.secrets.push({ key, value: secretValue });
        } else {
          // ERROR STATE: Key exists, but decryption failed (corrupted data)
          await this.showToast(`Decryption failed for "${key}". Data may be corrupted.`);
        }
      }
    } catch (error) {
      console.error('Critical error loading vault keys:', error);
      await this.showToast('Fatal error accessing the secure keystore.');
    }
  }

  async presentAddSecretPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Add New Secret',
      inputs: [
        { name: 'key', type: 'text', placeholder: 'Name (e.g., Office WiFi)' },
        { name: 'value', type: 'text', placeholder: 'Secret Value' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Securely Save',
          handler: async (data) => {
            if (data.key && data.value) {

              console.log('Data to be passed in saving secret storage :::', data.key, data.value);

              const success = await this.secureStorage.saveSecret(data.key, data.value);

              console.log('Success variable value after callback to secure storage :::', success);

              if (success) {

                await this.loadSecrets(); // Refresh the list

              } else {
                await this.showToast('Hardware encryption failed. Could not save.');
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Updates the search query string
  handleSearch(event: any) {
    this.searchQuery = event.target.value;
  }

  async deleteSecret(key: string) {
    console.log('Key value passed for delete Secret function call :::', key);
    const success = await this.secureStorage.removeSecret(key);
    if (success) {
      await this.loadSecrets();
    } else {
      await this.showToast('Failed to delete the secret from the keystore.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
}
