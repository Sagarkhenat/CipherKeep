import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lock-screen',
    pathMatch: 'full',
  },
  {
    path: 'lock-screen',
    loadComponent: () => import('./features/lock-screen/lock-screen.component').then(m => m.LockScreenComponent)
  },
  {
    path: 'tabs',
    // We apply the guard here. This single line protects the Vault, Generator, and Settings.
    canActivate: [authGuard],
    loadChildren: () => import('./features/tabs/tabs.routes').then(m => m.routes)
  }
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./features/tabs/tabs.routes').then((m) => m.routes),
  // },
  // {
  //   path: '',
  //   redirectTo: 'tabs',
  //   pathMatch: 'full',
  // },
];
