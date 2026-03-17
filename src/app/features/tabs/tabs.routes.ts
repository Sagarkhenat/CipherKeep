import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'vault',
        loadComponent: () => import('../vault/vault/vault.component').then((m) => m.VaultComponent),
      },
      {
        path: 'generator',
        loadComponent: () => import('../generator/generator.component').then((m) => m.GeneratorComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: '',
        redirectTo: 'vault',
        pathMatch: 'full',
      },
    ],
  },
];
