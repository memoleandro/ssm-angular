import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SsmService } from '../../../core/services/ssm.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profissional, ProfSelected } from '../../../core/models';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultado.component.html',
})
export class ResultadoComponent {
  readonly sol    = this.ssm.solicitacao;
  readonly res    = this.ssm.resultado;
  readonly user   = this.auth.user;

  selected: Record<string, ProfSelected> = {};

  constructor(
    private ssm: SsmService,
    private auth: AuthService,
    private router: Router,
  ) {
    if (!this.sol()) this.router.navigate(['/compartilhamento/nova-solicitacao']);
  }

  get selectedList(): ProfSelected[] { return Object.values(this.selected); }
  get canIniciar(): boolean { return this.selectedList.length > 0; }

  get diasSla(): number | null {
    const s = this.sol();
    return s?.temOS === 'sim' && s.dOS ? this.ssm.bizLeft(s.dOS) : null;
  }

  get slaInfo() {
    const s = this.sol();
    return this.ssm.slaInfo(s?.temOS ?? 'nao', s?.dOS ?? '');
  }

  toggleSelect(p: Profissional): void {
    if (!p.apto) return;
    if (this.selected[p.mat]) {
      const copy = { ...this.selected };
      delete copy[p.mat];
      this.selected = copy;
    } else {
      this.selected = { ...this.selected, [p.mat]: { prof: p, proposta: '', propostaNum: 0 } };
    }
  }

  setProposta(mat: string, val: string): void {
    const nums = val.replace(/\D/g, '');
    const n = parseInt(nums || '0', 10);
    const fmt = n === 0 ? '' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.selected = {
      ...this.selected,
      [mat]: { ...this.selected[mat], proposta: fmt, propostaNum: n }
    };
  }

  getCompContratos(p: Profissional) { return this.ssm.getCompContratos(p); }
  fmtR(v: number | null) { return this.ssm.fmtR(v); }

  rankBg(p: Profissional): string {
    const is100 = p.match?.pct === 100;
    if (!p.apto) return is100 ? 'var(--red)' : '#ef4444';
    if (p.comp === 0 && is100) return 'var(--t6)';
    if (is100) return 'var(--t5)';
    return 'var(--g6)';
  }

  novaBusca(): void { this.router.navigate(['/compartilhamento/nova-solicitacao']); }

  iniciarTratativa(): void {
    const sol = this.sol()!;
    const u = this.user()!;
    this.ssm.setSelected(this.selectedList);
    this.ssm.iniciarTratativa(sol, this.selectedList, u.nome);
    this.router.navigate(['/compartilhamento/tratativa']);
  }
}
