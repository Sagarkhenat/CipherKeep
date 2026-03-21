import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonIcon, IonLabel, IonText,
  IonListHeader, ModalController,IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline, fingerPrintOutline,
  keyOutline, flashOutline, trashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: true,
  imports: [IonButton, IonButtons,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonIcon, IonLabel, IonText,IonListHeader
  ]
})
export class OnboardingComponent {
  private modalCtrl = inject(ModalController);
  constructor() {
    addIcons({
      shieldCheckmarkOutline, fingerPrintOutline,
      keyOutline, flashOutline, trashOutline
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
