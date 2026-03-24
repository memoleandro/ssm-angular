import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuarios: Usuario[] = [
    { id: 1, nome: 'Haylla',   cargo: 'Diretora' },
    { id: 2, nome: 'Leandro',  cargo: 'Gerente de Contrato' },
    { id: 3, nome: 'Magally',  cargo: 'Superintendente I' },
    { id: 4, nome: 'Gabriela', cargo: 'Superintendente II' },
    { id: 5, nome: 'Gustavo',  cargo: 'Gestor de Portfolio - Sup. I' },
    { id: 6, nome: 'Rafaela',  cargo: 'Gerente de Contrato' },
    { id: 7, nome: 'Aline',    cargo: 'Gerente de Contrato' },
  ];

  private _user = signal<Usuario | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private router: Router) {}

  login(userId: number): void {
    const u = this.usuarios.find(x => x.id === userId);
    if (u) {
      this._user.set(u);
      this.router.navigate(['/compartilhamento/nova-solicitacao']);
    }
  }

  logout(): void {
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
