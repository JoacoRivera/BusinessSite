import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@theme/theme.service';
import { AuthService } from '@core/services/auth.service';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  settings: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'button';
  value?: string | number | boolean;
  options?: { value: string | number | boolean; label: string }[];
  action?: () => void;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  // Signals para el estado del componente
  private readonly _activeSection = signal<string>('appearance');
  private readonly _isDarkMode = signal<boolean>(false);

  // Computed signals
  public readonly activeSection = this._activeSection.asReadonly();
  public readonly isDarkMode = this.themeService.isDarkMode;

  // Secciones de configuración
  public readonly settingSections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Apariencia',
      description: 'Personaliza el aspecto visual de la aplicación',
      icon: '🎨',
      settings: [
        {
          id: 'darkMode',
          label: 'Modo Oscuro',
          description: 'Cambiar entre tema claro y oscuro',
          type: 'toggle',
          value: this.isDarkMode(),
          action: () => this.toggleDarkMode(),
        },
        {
          id: 'compactMode',
          label: 'Modo Compacto',
          description: 'Reducir el espaciado entre elementos',
          type: 'toggle',
          value: false,
        },
        {
          id: 'animations',
          label: 'Animaciones',
          description: 'Habilitar transiciones y animaciones',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      id: 'users',
      title: 'Usuarios & Roles',
      description: 'Gestionar usuarios y permisos del sistema',
      icon: '👥',
      settings: [
        {
          id: 'userManagement',
          label: 'Gestión de Usuarios',
          description: 'Crear, editar y eliminar usuarios',
          type: 'button',
          action: () => this.openUserManagement(),
        },
        {
          id: 'roleManagement',
          label: 'Gestión de Roles',
          description: 'Configurar roles y permisos',
          type: 'button',
          action: () => this.openRoleManagement(),
        },
        {
          id: 'permissions',
          label: 'Permisos',
          description: 'Configurar permisos del sistema',
          type: 'button',
          action: () => this.openPermissions(),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Configurar preferencias de notificaciones',
      icon: '🔔',
      settings: [
        {
          id: 'emailNotifications',
          label: 'Notificaciones por Email',
          description: 'Recibir notificaciones por correo electrónico',
          type: 'toggle',
          value: true,
        },
        {
          id: 'pushNotifications',
          label: 'Notificaciones Push',
          description: 'Mostrar notificaciones en tiempo real',
          type: 'toggle',
          value: true,
        },
        {
          id: 'notificationFrequency',
          label: 'Frecuencia de Notificaciones',
          description: 'Seleccionar frecuencia de notificaciones',
          type: 'select',
          value: 'daily',
          options: [
            { value: 'immediate', label: 'Inmediato' },
            { value: 'hourly', label: 'Cada hora' },
            { value: 'daily', label: 'Diario' },
            { value: 'weekly', label: 'Semanal' },
          ],
        },
      ],
    },
    {
      id: 'localization',
      title: 'Localización & Moneda',
      description: 'Configurar idioma, zona horaria y moneda',
      icon: '🌍',
      settings: [
        {
          id: 'language',
          label: 'Idioma',
          description: 'Seleccionar idioma de la aplicación',
          type: 'select',
          value: 'es-PE',
          options: [
            { value: 'es-PE', label: 'Español (Perú)' },
            { value: 'en-US', label: 'English (US)' },
            { value: 'es-ES', label: 'Español (España)' },
          ],
        },
        {
          id: 'timezone',
          label: 'Zona Horaria',
          description: 'Configurar zona horaria local',
          type: 'select',
          value: 'America/Lima',
          options: [
            { value: 'America/Lima', label: 'Lima (GMT-5)' },
            { value: 'America/New_York', label: 'New York (GMT-5/-4)' },
            { value: 'Europe/Madrid', label: 'Madrid (GMT+1/+2)' },
          ],
        },
        {
          id: 'currency',
          label: 'Moneda',
          description: 'Seleccionar moneda principal',
          type: 'select',
          value: 'PEN',
          options: [
            { value: 'PEN', label: 'Soles (PEN)' },
            { value: 'USD', label: 'Dólares (USD)' },
            { value: 'EUR', label: 'Euros (EUR)' },
          ],
        },
      ],
    },
    {
      id: 'integrations',
      title: 'Integraciones',
      description: 'Conectar con servicios externos',
      icon: '🔗',
      settings: [
        {
          id: 'apiKeys',
          label: 'Claves API',
          description: 'Gestionar claves de API externas',
          type: 'button',
          action: () => this.openApiKeys(),
        },
        {
          id: 'webhooks',
          label: 'Webhooks',
          description: 'Configurar webhooks para integraciones',
          type: 'button',
          action: () => this.openWebhooks(),
        },
        {
          id: 'thirdParty',
          label: 'Servicios de Terceros',
          description: 'Conectar con servicios externos',
          type: 'button',
          action: () => this.openThirdParty(),
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferencias',
      description: 'Configuraciones generales del sistema',
      icon: '⚙️',
      settings: [
        {
          id: 'dataExport',
          label: 'Exportar Datos',
          description: 'Exportar datos del sistema',
          type: 'button',
          action: () => this.exportData(),
        },
        {
          id: 'backup',
          label: 'Respaldo',
          description: 'Configurar respaldos automáticos',
          type: 'button',
          action: () => this.configureBackup(),
        },
        {
          id: 'maintenance',
          label: 'Modo Mantenimiento',
          description: 'Habilitar modo mantenimiento',
          type: 'toggle',
          value: false,
        },
      ],
    },
  ];

  constructor() {
    // Inicializar el estado del modo oscuro
    this._isDarkMode.set(this.isDarkMode());
  }

  /**
   * Cambia la sección activa
   */
  public setActiveSection(sectionId: string): void {
    this._activeSection.set(sectionId);
  }

  /**
   * Obtiene la sección activa
   */
  public getActiveSection(): SettingSection | undefined {
    return this.settingSections.find(section => section.id === this.activeSection());
  }

  /**
   * Alterna el modo oscuro
   */
  public toggleDarkMode(): void {
    this.themeService.toggle();
  }

  /**
   * Obtiene el valor de una configuración
   */
  public getSettingValue(setting: SettingItem): string | number | boolean | undefined {
    if (setting.id === 'darkMode') {
      return this.isDarkMode();
    }
    return setting.value;
  }

  /**
   * Actualiza el valor de una configuración
   */
  public updateSetting(setting: SettingItem, value: string | number | boolean): void {
    if (setting.id === 'darkMode') {
      this.toggleDarkMode();
      return;
    }

    // En una implementación real, aquí se guardaría en el backend
    setting.value = value;
    console.log(`Configuración actualizada: ${setting.id} = ${value}`);
  }

  /**
   * Ejecuta la acción de una configuración
   */
  public executeSettingAction(setting: SettingItem): void {
    if (setting.action) {
      setting.action();
    }
  }

  /**
   * Obtiene el nombre de la empresa actual
   */
  public getCompanyName(): string {
    return this.authService.getCurrentCompany()?.name || 'Empresa';
  }

  /**
   * Obtiene el nombre del usuario actual
   */
  public getUserName(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  // Métodos placeholder para las acciones de configuración
  private openUserManagement(): void {
    console.log('Abrir gestión de usuarios');
    // TODO: Implementar navegación a gestión de usuarios
  }

  private openRoleManagement(): void {
    console.log('Abrir gestión de roles');
    // TODO: Implementar navegación a gestión de roles
  }

  private openPermissions(): void {
    console.log('Abrir configuración de permisos');
    // TODO: Implementar navegación a permisos
  }

  private openApiKeys(): void {
    console.log('Abrir gestión de claves API');
    // TODO: Implementar gestión de claves API
  }

  private openWebhooks(): void {
    console.log('Abrir configuración de webhooks');
    // TODO: Implementar configuración de webhooks
  }

  private openThirdParty(): void {
    console.log('Abrir servicios de terceros');
    // TODO: Implementar servicios de terceros
  }

  private exportData(): void {
    console.log('Exportar datos');
    // TODO: Implementar exportación de datos
  }

  private configureBackup(): void {
    console.log('Configurar respaldo');
    // TODO: Implementar configuración de respaldo
  }
}
