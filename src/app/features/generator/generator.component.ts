import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
          IonIcon, IonContent, IonList, IonItem, IonLabel} from '@ionic/angular/standalone';
// Import the specific icon for the copy button
import { addIcons } from 'ionicons';
import { copyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
  standalone: true,
  imports: [CommonModule,IonHeader, IonToolbar, IonTitle, IonButton,
          IonIcon, IonContent]
})
export class GeneratorComponent {
  // Placeholder string until we build the real generator logic next session
  generatedPassword = 'PlaceholderPassword123!';

  constructor(private toastCtrl: ToastController) {
    // Register the icon immediately to prevent console errors
    addIcons({ copyOutline });
  }

  async copyToClipboard() {
    try {
      // Write the string natively to the device clipboard
      await Clipboard.write({
        string: this.generatedPassword
      });

      // Provide graceful UI feedback
      const toast = await this.toastCtrl.create({
        message: 'Password copied to clipboard!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      console.error('Failed to copy text:', error);
      const errorToast = await this.toastCtrl.create({
        message: 'Failed to copy to clipboard.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await errorToast.present();
    }
  }
}
