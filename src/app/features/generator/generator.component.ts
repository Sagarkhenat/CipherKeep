import { Component, signal, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Clipboard } from '@capacitor/clipboard';
import { addIcons } from 'ionicons';
import { copyOutline, refreshOutline, warningOutline } from 'ionicons/icons';
import { IonHeader, IonToolbar, IonTitle, IonButton,
  IonIcon, IonContent, IonListHeader, IonRange, IonItem,
  IonLabel, IonList,IonToggle,RangeCustomEvent} from '@ionic/angular/standalone';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
  standalone: true,
  // Ensure your Ionic module imports are here based on your previous setup
  imports:[IonHeader, IonToolbar, IonTitle, IonButton,
    IonIcon, IonContent, IonListHeader, IonRange, IonItem,
    IonLabel, IonList,IonToggle]
})
export class GeneratorComponent {

  // Reactive State Signals
  passwordLength = signal<number>(16);
  useUppercase = signal<boolean>(true);
  useLowercase = signal<boolean>(true); // Implicitly always true or toggleable
  useNumbers = signal<boolean>(true);
  useSymbols = signal<boolean>(true);

  generatedPassword = signal<string>('');
  errorMessage = signal<string>('');

  constructor( private toastController: ToastController) {
    addIcons({ copyOutline, refreshOutline, warningOutline });
    this.generatePassword(); // Generate one immediately on load
  }

  generatePassword() {
    // Clear previous errors
    this.errorMessage.set('');

    // Error State 1: User deselected all character types
    if (!this.useUppercase() && !this.useLowercase() && !this.useNumbers() && !this.useSymbols()) {
      this.errorMessage.set('Please select at least one character type.');
      this.generatedPassword.set('');
      this.showErrorToast('Cannot generate an empty password.');
      return;
    }

    // Error State 2: Invalid length (safeguard, even though UI slider restricts this)
    if (this.passwordLength() < 4 || this.passwordLength() > 64) {
      this.errorMessage.set('Password length must be between 4 and 64 characters.');
      return;
    }

    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charSet = '';
    if (this.useLowercase()) charSet += lower;
    if (this.useUppercase()) charSet += upper;
    if (this.useNumbers()) charSet += numbers;
    if (this.useSymbols()) charSet += symbols;

    // Cryptographically secure generation
    const randomValues = new Uint32Array(this.passwordLength());
    window.crypto.getRandomValues(randomValues);

    let finalPassword = '';
    for (let i = 0; i < randomValues.length; i++) {
      finalPassword += charSet[randomValues[i] % charSet.length];
    }

    this.generatedPassword.set(finalPassword);
  }

  async copyToClipboard() {
    const pwd = this.generatedPassword();

    // Error State 3: Attempting to copy when no password exists
    if (!pwd) {
      this.showErrorToast('No password to copy.');
      return;
    }

    try {
      await Clipboard.write({ string: pwd });

      const toast = await this.toastController.create({
        message: 'Password copied to clipboard!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (error) {
      // Error State 4: Native clipboard plugin failure
      this.showErrorToast('Failed to access clipboard.');
    }
  }

  onLengthChange(event: Event) {
    const customEvent = event as RangeCustomEvent;
    this.passwordLength.set(customEvent.detail.value as number);
    this.generatePassword();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      icon: 'warning-outline',
      position: 'bottom'
    });
    await toast.present();
  }
}
