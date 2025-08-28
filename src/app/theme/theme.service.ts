import { Injectable, signal, computed } from '@angular/core';
import { environment } from '@env/environment';

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: ThemeColors;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'business-suite-theme';

  // Signals para el estado del tema
  private readonly _currentTheme = signal<Theme['name']>('light');
  public readonly currentTheme = this._currentTheme.asReadonly();

  // Computed signal para verificar si está en modo oscuro
  public readonly isDarkMode = computed(() => this._currentTheme() === 'dark');

  // Observable para compatibilidad con código existente
  public readonly isDarkMode$ = computed(() => this.isDarkMode());

  constructor() {
    this.initializeTheme();
  }

  /**
   * Inicializa el tema desde localStorage o usa el tema por defecto
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme['name'];
    const theme = savedTheme || environment.theme.defaultTheme;
    this.setTheme(theme);
  }

  /**
   * Aplica el tema especificado al documento
   */
  private setTheme(themeName: Theme['name']): void {
    const theme = this.getThemeDefinition(themeName);
    this._currentTheme.set(themeName);

    // Aplicar variables CSS al :root
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Agregar clase al body para estilos adicionales
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${themeName}`);

    // Persistir en localStorage
    localStorage.setItem(this.THEME_KEY, themeName);
  }

  /**
   * Obtiene la definición del tema
   */
  private getThemeDefinition(themeName: Theme['name']): Theme {
    const baseColors = {
      primary: environment.theme.primaryColor,
      accent: environment.theme.accentColor,
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    };

    if (themeName === 'dark') {
      return {
        name: 'dark',
        colors: {
          ...baseColors,
          bg: '#121212',
          surface: '#1e1e1e',
          text: '#ffffff',
          muted: '#b0b0b0',
          border: '#333333',
        },
      };
    }

    return {
      name: 'light',
      colors: {
        ...baseColors,
        bg: '#fafafa',
        surface: '#ffffff',
        text: '#212121',
        muted: '#757575',
        border: '#e0e0e0',
      },
    };
  }

  /**
   * Habilita el tema oscuro
   */
  public enableDark(): void {
    this.setTheme('dark');
  }

  /**
   * Habilita el tema claro
   */
  public enableLight(): void {
    this.setTheme('light');
  }

  /**
   * Alterna entre temas
   */
  public toggle(): void {
    const newTheme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Obtiene el tema actual
   */
  public getCurrentTheme(): Theme['name'] {
    return this._currentTheme();
  }
}
