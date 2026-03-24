import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  selectedId: number | null = null;

  readonly usuarios = this.auth.usuarios;

  constructor(private auth: AuthService) {}

  login(): void {
    if (this.selectedId) this.auth.login(this.selectedId);
  }
}
