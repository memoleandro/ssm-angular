import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SsmService } from '../../../core/services/ssm.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tratativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tratativa.component.html',
})
export class TratativaComponent {
  readonly sol      = this.ssm.solicitacao;
  readonly selected = this.ssm.selected;
  readonly user     = this.auth.user;

  showEmail = false;

  get codCounter() { return this.ssm.codCounter(); }

  get cod(): string {
    // O cod foi gerado no iniciarTratativa; recuperamos pela lista
    const comp = this.ssm.compartilhamentos()[0];
    return comp?.cod ?? 'C01';
  }

  get diasSla(): number | null {
    const s = this.sol();
    return s?.temOS === 'sim' && s.dOS ? this.ssm.bizLeft(s.dOS) : null;
  }

  get slaInfo() {
    const s = this.sol();
    return this.ssm.slaInfo(s?.temOS ?? 'nao', s?.dOS ?? '');
  }

  get emailBody(): string {
    const s = this.sol()!;
    const u = this.user()!;
    const sup = s.contratoObj ? this.ssm.supers[s.contratoObj.sup] : null;
    const linhas = this.selected().map((sl, i) =>
      `${i + 1}. ${sl.prof.nome}${sl.propostaNum > 0 ? ' – Adicional proposto: ' + this.ssm.fmtR(sl.propostaNum) : ''}`
    ).join('\n');
    return `Para: ${sup?.email ?? 'superintendente@memora.com.br'}
De: ${u.nome} (${u.cargo})
Assunto: [SSM] Solicitacao de Compartilhamento – ${this.cod} – ${s.cargo}

Prezada ${sup?.superintendente ?? 'Superintendente'},

Registro a abertura da demanda ${this.cod} para o contrato ${s.contratoObj?.nome ?? ''}, com a necessidade do perfil ${s.cargo}.

Profissional(is) indicado(s):
${linhas}

Solicito sua analise e aprovacao para prosseguir com as tratativas.

Atenciosamente,
${u.nome}
${u.cargo}`;
  }

  fmtR(v: number | null) { return this.ssm.fmtR(v); }
  fmtD(s: string) { return this.ssm.fmtD(s); }

  constructor(private ssm: SsmService, private auth: AuthService, private router: Router) {
    if (!this.sol()) this.router.navigate(['/compartilhamento/nova-solicitacao']);
  }

  novaBusca(): void { this.router.navigate(['/compartilhamento/nova-solicitacao']); }
  irParaDemandas(): void { this.router.navigate(['/compartilhamento/demandas']); }

  copiarEmail(): void { navigator.clipboard?.writeText(this.emailBody); this.showEmail = false; }
}
