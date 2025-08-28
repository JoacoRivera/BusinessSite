import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@theme/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  // Signals para el estado del layout
  private readonly _sidebarExpanded = signal<boolean>(true);
  private readonly _searchQuery = signal<string>('');

  // Computed signals
  public readonly sidebarExpanded = this._sidebarExpanded.asReadonly();
  public readonly searchQuery = this._searchQuery.asReadonly();

  // Signals del servicio de autenticación
  public readonly currentUser = this.authService.currentUser;
  public readonly currentCompany = this.authService.currentCompany;
  public readonly isDarkMode = this.themeService.isDarkMode;

  // Menú de navegación
  public readonly navigationItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      badge: null,
    },
    {
      label: 'Ventas',
      icon: 'point_of_sale',
      route: '/modules/sales',
      badge: '3',
    },
    {
      label: 'Inventario',
      icon: 'inventory',
      route: '/modules/inventory',
      badge: null,
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/modules/customers',
      badge: '12',
    },
    {
      label: 'Reportes',
      icon: 'analytics',
      route: '/modules/reports',
      badge: null,
    },
    {
      label: 'Finanzas',
      icon: 'account_balance',
      route: '/modules/finance',
      badge: '5',
    },
  ];

  // Menú de usuario
  public readonly userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'person',
      action: () => this.openProfile(),
    },
    {
      label: 'Configuración',
      icon: 'settings',
      action: () => this.openSettings(),
    },
    {
      label: 'Ayuda',
      icon: 'help',
      action: () => this.openHelp(),
    },
  ];

  /**
   * Alterna la expansión del sidebar
   */
  public toggleSidebar(): void {
    this._sidebarExpanded.set(!this._sidebarExpanded());
  }

  /**
   * Actualiza la consulta de búsqueda
   */
  public updateSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  /**
   * Ejecuta la búsqueda
   */
  public performSearch(): void {
    const query = this._searchQuery();
    if (query.trim()) {
      console.log('Buscando:', query);
      // TODO: Implementar lógica de búsqueda
    }
  }

  /**
   * Alterna el tema
   */
  public toggleTheme(): void {
    this.themeService.toggle();
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    this.authService.logout();
  }

  /**
   * Abre el perfil del usuario
   */
  private openProfile(): void {
    console.log('Abrir perfil del usuario');
    // TODO: Implementar navegación al perfil
  }

  /**
   * Abre la página de configuración
   */
  private openSettings(): void {
    console.log('Abrir configuración');
    // TODO: Implementar navegación a configuración
  }

  /**
   * Abre la ayuda
   */
  private openHelp(): void {
    console.log('Abrir ayuda');
    // TODO: Implementar sistema de ayuda
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  public getUserFullName(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Obtiene el nombre de la empresa
   */
  public getCompanyName(): string {
    const company = this.currentCompany();
    return company?.name || '';
  }

  /**
   * Obtiene el código de la empresa
   */
  public getCompanyCode(): string {
    const company = this.currentCompany();
    return company?.code || '';
  }
}
