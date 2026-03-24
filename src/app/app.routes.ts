import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user()) return true;
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'compartilhamento',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'nova-solicitacao', pathMatch: 'full' },
      {
        path: 'nova-solicitacao',
        loadComponent: () => import('./features/compartilhamento/nova-solicitacao/nova-solicitacao.component').then(m => m.NovaSolicitacaoComponent),
      },
      {
        path: 'resultado',
        loadComponent: () => import('./features/compartilhamento/resultado/resultado.component').then(m => m.ResultadoComponent),
      },
      {
        path: 'tratativa',
        loadComponent: () => import('./features/compartilhamento/tratativa/tratativa.component').then(m => m.TratativaComponent),
      },
      {
        path: 'demandas',
        loadComponent: () => import('./features/compartilhamento/demandas/demandas.component').then(m => m.DemandasComponent),
      },
      {
        path: 'dev/:label',
        loadComponent: () => import('./features/compartilhamento/dev-screen/dev-screen.component').then(m => m.DevScreenComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
