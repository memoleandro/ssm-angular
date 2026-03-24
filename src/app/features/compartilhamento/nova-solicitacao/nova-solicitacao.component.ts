import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SsmService } from '../../../core/services/ssm.service';
import { Contrato } from '../../../core/models';

interface ToolCatState { open: boolean }

@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nova-solicitacao.component.html',
})
export class NovaSolicitacaoComponent {
  modo: 'base' | 'direto' | null = null;

  // Bloco 1
  natureza = '';
  naturezaOpts = [
    { v: 'reposicao', label: 'Reposição de profissional', icon: '🔁' },
    { v: 'expansao',  label: 'Expansão de escopo',        icon: '📈' },
    { v: 'cobertura', label: 'Cobertura temporária',       icon: '⏱' },
  ];

  // Bloco 2
  contratoId  = '';
  temOS       = 'não';
  dOS         = '';
  vagaCritica = 'NÃO';
  criticidade = '';
  dataHoje    = new Date().toLocaleDateString('pt-BR');

  // Bloco 3
  cargo  = '';
  certs: string[] = [];
  langs: string[] = [];
  tools: string[] = [];
  obs   = '';
  busy  = false;

  toolsCatState: ToolCatState[] = [];
  certOpen = false;
  langOpen = false;

  readonly supers    = ['Superintendência I', 'Superintendência II', 'Superintendência III'];
  readonly contratos = this.ssm.contratos;
  readonly cargos    = this.ssm.cargos;
  readonly certsOpts = this.ssm.certsOpts;
  readonly langsOpts = this.ssm.langsOpts;
  readonly toolsCats = this.ssm.toolsCats;

  constructor(private ssm: SsmService, private router: Router) {
    this.toolsCatState = this.toolsCats.map(() => ({ open: false }));
  }

  getContratosBySup(sup: string): Contrato[] { return this.ssm.getContratosBySup(sup); }

  get contratoObj(): Contrato | null {
    return this.contratos.find(c => c.id === this.contratoId) ?? null;
  }

  get slaInfo()  { return this.ssm.slaInfo(this.temOS, this.dOS); }
  get slaDias(): number | null { return this.ssm.bizLeft(this.dOS); }

  private toggleTag(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  toggleCert(c: string): void { this.certs = this.toggleTag(this.certs, c); }
  toggleLang(l: string): void { this.langs = this.toggleTag(this.langs, l); }
  toggleTool(t: string): void { this.tools = this.toggleTag(this.tools, t); }

  buscar(): void {
    if (!this.cargo || !this.contratoId) return;
    this.busy = true;
    setTimeout(() => {
      const res = this.ssm.buscar(this.cargo, this.certs, this.langs, this.tools);
      this.ssm.setSolicitacao({
        contratoObj: this.contratoObj,
        temOS: this.temOS, dOS: this.dOS,
        cargo: this.cargo, vagaCritica: this.vagaCritica,
        criticidade: this.criticidade,
        certs: this.certs, langs: this.langs, tools: this.tools,
        natureza: this.natureza,
      });
      this.ssm.setResultado(res);
      this.busy = false;
      this.router.navigate(['/compartilhamento/resultado']);
    }, 600);
  }
}
