import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dev-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-inner" style="text-align:center;padding:60px 24px">
      <div style="font-size:48px;margin-bottom:16px">🚧</div>
      <div style="font-size:20px;font-weight:800;color:var(--g6);margin-bottom:8px">{{ label }}</div>
      <div style="font-size:14px;color:var(--g4)">
        Este módulo está em desenvolvimento e será disponibilizado em breve.
      </div>
    </div>
  `,
})
export class DevScreenComponent {
  label = 'Módulo em breve';
  constructor(private route: ActivatedRoute) {
    this.label = this.route.snapshot.paramMap.get('label') ?? 'Módulo';
  }
}
