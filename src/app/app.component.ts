import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  collapsed = false;
  activeItem = 'buscar';

  readonly user = this.auth.user;
  readonly isLoggedIn = computed(() => !!this.auth.user());

  constructor(private auth: AuthService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects;
      if (url.includes('nova-solicitacao')) this.activeItem = 'buscar';
      else if (url.includes('demandas'))    this.activeItem = 'gerir';
    });
  }

  onNav(id: string): void {
    this.activeItem = id;
    if (id === 'buscar') this.router.navigate(['/compartilhamento/nova-solicitacao']);
    if (id === 'gerir')  this.router.navigate(['/compartilhamento/demandas']);
  }

  logout(): void { this.auth.logout(); }
}
