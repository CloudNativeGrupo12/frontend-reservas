import { Routes } from '@angular/router';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  { path: 'auth', component: MsalRedirectComponent },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/reservas/reservas.component').then((m) => m.ReservasComponent),
    canActivate: [MsalGuard],
  },
  {
    path: 'disponibilidad',
    loadComponent: () =>
      import('./pages/disponibilidad/disponibilidad.component').then(
        (m) => m.DisponibilidadComponent,
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'notificaciones',
    loadComponent: () =>
      import('./pages/notificaciones/notificaciones.component').then(
        (m) => m.NotificacionesComponent,
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'auditoria',
    loadComponent: () =>
      import('./pages/auditoria/auditoria.component').then((m) => m.AuditoriaComponent),
    canActivate: [MsalGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-rabbitmq/admin-rabbitmq.component').then(
        (m) => m.AdminRabbitmqComponent,
      ),
    canActivate: [MsalGuard],
  },
  { path: '**', redirectTo: '' },
];
