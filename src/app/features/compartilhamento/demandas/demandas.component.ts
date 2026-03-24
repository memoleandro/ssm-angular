import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsmService } from '../../../core/services/ssm.service';
import { AuthService } from '../../../core/services/auth.service';
import { Compartilhamento, StatusStyle, SlaInfo } from '../../../core/models';

const STATUS_EM_TRATATIVAS = [
  'Em tratativas na Superintendência',
  'Em tratativas com o candidato e/ou cliente',
  'Definindo critérios de rateio',
  'Em aprovação pela Diretoria',
];

@Component({
  selector: 'app-demandas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demandas.component.html',
})
export class DemandasComponent {
  readonly user              = this.auth.user;
  readonly compartilhamentos = this.ssm.compartilhamentos;

  filtroStatus = 'todos';
  modalAlterar:  Compartilhamento | null = null;
  modalCancelar: Compartilhamento | null = null;
  modalVerMais:  Compartilhamento | null = null;
  canceladoOk = false;

  readonly statusFlow = this.ssm.statusFlow;

  constructor(private ssm: SsmService, private auth: AuthService) {}

  get visiveis(): Compartilhamento[] {
    return this.ssm.getSortedVisiveis(
      this.compartilhamentos(),
      this.user()?.cargo ?? '',
      this.user()?.nome  ?? ''
    );
  }

  get ordenados(): Compartilhamento[] {
    const v = this.visiveis;
    switch (this.filtroStatus) {
      case 'em-tratativas': return v.filter(c => STATUS_EM_TRATATIVAS.includes(c.status));
      case 'finalizando':   return v.filter(c => c.status === 'Cadastrando compartilhamento');
      case 'vigentes':      return v.filter(c => c.status === 'Em vigência');
      case 'cancelados':    return v.filter(c => c.status === 'Cancelado');
      default:              return v;
    }
  }

  get totais() {
    const v = this.visiveis;
    return {
      total:         v.length,
      emTratativas:  v.filter(c => STATUS_EM_TRATATIVAS.includes(c.status)).length,
      finalizando:   v.filter(c => c.status === 'Cadastrando compartilhamento').length,
      vigentes:      v.filter(c => c.status === 'Em vigência').length,
      cancelados:    v.filter(c => c.status === 'Cancelado').length,
    };
  }

  get cards() {
    const t = this.totais;
    return [
      { key: 'todos',         label: 'Total',          n: t.total,        bg: 'var(--g0)',    border: 'var(--g2)',    color: 'var(--g8)' },
      { key: 'em-tratativas', label: 'Em tratativas',  n: t.emTratativas, bg: '#fffbeb',      border: '#fde68a',     color: '#d97706'  },
      { key: 'finalizando',   label: 'Finalizando',    n: t.finalizando,  bg: '#f0fdfa',      border: '#99f6e4',     color: '#0d9488'  },
      { key: 'vigentes',      label: 'Vigentes',       n: t.vigentes,     bg: 'var(--grnbg)', border: '#bbf7d0',     color: 'var(--grn)' },
      { key: 'cancelados',    label: 'Cancelados',     n: t.cancelados,   bg: 'var(--rdbg)',  border: 'var(--rdbdr)',color: 'var(--red)' },
    ];
  }

  toggleFiltro(key: string): void {
    this.filtroStatus = this.filtroStatus === key ? 'todos' : key;
  }

  slaInfo(c: Compartilhamento): SlaInfo  { return this.ssm.slaInfo(c.temOS, c.dOS); }
  getStatusStyle(status: string): StatusStyle { return this.ssm.getStatusStyle(status); }
  fmtR(v: number | null)  { return this.ssm.fmtR(v); }
  fmtD(s: string)         { return this.ssm.fmtD(s); }

  semNome(c: Compartilhamento): boolean    { return !c.profs[0]?.nome; }
  isCancelado(c: Compartilhamento): boolean { return c.status === 'Cancelado'; }

  abrirCancelar(c: Compartilhamento): void  { this.modalCancelar = c; this.canceladoOk = false; }
  abrirVerMais(c: Compartilhamento): void   { this.modalVerMais = c; }

  confirmarCancelamento(): void {
    if (this.modalCancelar) {
      this.ssm.cancelarCompartilhamento(this.modalCancelar.cod);
      this.canceladoOk = true;
    }
  }

  fecharModais(): void {
    this.modalAlterar  = null;
    this.modalCancelar = null;
    this.modalVerMais  = null;
    this.canceladoOk   = false;
  }

  cardBorder(card: any): string {
    return this.filtroStatus === card.key ? card.color : card.border;
  }
  cardShadow(card: any): string {
    return this.filtroStatus === card.key ? '0 0 0 3px rgba(0,0,0,.08)' : 'none';
  }

  custoTotal(c: Compartilhamento): string {
    const p = c.profs[0];
    if (!p?.custo) return '—';
    if (p.adic) return this.ssm.fmtR(p.custo + p.adic);
    return this.ssm.fmtR(p.custo);
  }
}
