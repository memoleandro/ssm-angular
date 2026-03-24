import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="topbar">
      <div class="tb-title">SSM — Sistema de Compartilhamento de Recursos</div>
      <div class="tb-user">
        <div class="tb-avatar">{{ user?.nome?.[0] }}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--g8)">{{ user?.nome }}</div>
          <div style="font-size:11px;color:var(--g4)">{{ user?.cargo }}</div>
        </div>
        <button class="bo" style="font-size:12px;padding:6px 12px;margin-left:8px"
          (click)="logoutClick.emit()">Sair</button>
      </div>
    </div>
  `,
})
export class TopbarComponent {
  @Input()  user: Usuario | null = null;
  @Output() logoutClick = new EventEmitter<void>();
}
