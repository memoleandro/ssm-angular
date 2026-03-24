import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  dev: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() collapsed  = false;
  @Input() activeItem = '';
  @Output() collapseToggle = new EventEmitter<void>();
  @Output() navClick       = new EventEmitter<string>();

  openGroup = 'compartilhamento';

  menuItems: MenuItem[] = [
    { id: 'buscar',          icon: '➕', label: 'Nova Solicitação',                 dev: false },
    { id: 'gerir',           icon: '📋', label: 'Demandas de Compartilhamento',     dev: false },
    { id: 'aprovacao',       icon: '✅', label: 'Aprovação de Valores',             dev: true  },
    { id: 'efetivacao',      icon: '🤝', label: 'Efetivação do Compartilhamento',   dev: true  },
    { id: 'monitoramento',   icon: '📊', label: 'Monitoramento',                    dev: true  },
    { id: 'cadastros',       icon: '📂', label: 'Cadastros e Parâmetros',           dev: true  },
  ];

  toggleGroup(): void {
    this.openGroup = this.openGroup === 'compartilhamento' ? '' : 'compartilhamento';
  }

  navigate(item: MenuItem): void {
    if (item.dev) return;
    this.navClick.emit(item.id);
  }
}
