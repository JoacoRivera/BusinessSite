import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import {
  User,
  Company,
  Session,
  LoginCredentials,
  LoginResponse,
  UserRole,
} from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SESSION_KEY = 'business-suite-session';

  // Signals para el estado de autenticación
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _currentCompany = signal<Company | null>(null);
  private readonly _session = signal<Session | null>(null);

  // Computed signals
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly currentCompany = this._currentCompany.asReadonly();
  public readonly session = this._session.asReadonly();

  // Mock data para empresas
  private readonly mockCompanies: Company[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      code: 'TECH',
      domain: 'techcorp.com',
      logo: 'assets/logos/techcorp.png',
      isActive: true,
      settings: {
        timezone: 'America/Lima',
        currency: 'PEN',
        language: 'es-PE',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '#,##0.00',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Global Industries',
      code: 'GLOB',
      domain: 'globalind.com',
      logo: 'assets/logos/global.png',
      isActive: true,
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en-US',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: '#,##0.00',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Innovate Systems',
      code: 'INNO',
      domain: 'innovatesys.com',
      logo: 'assets/logos/innovate.png',
      isActive: true,
      settings: {
        timezone: 'Europe/Madrid',
        currency: 'EUR',
        language: 'es-ES',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '#,##0.00',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  // Mock data para usuarios
  private readonly mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@techcorp.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      avatar: 'assets/avatars/admin.png',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      username: 'manager',
      email: 'manager@techcorp.com',
      firstName: 'Manager',
      lastName: 'User',
      role: UserRole.MANAGER,
      avatar: 'assets/avatars/manager.png',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      username: 'user',
      email: 'user@techcorp.com',
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      avatar: 'assets/avatars/user.png',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  private readonly router = inject(Router);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  private initializeAuth(): void {
    const savedSession = localStorage.getItem(this.SESSION_KEY);
    if (savedSession) {
      try {
        const session: Session = JSON.parse(savedSession);
        // Verificar si la sesión no ha expirado
        if (new Date(session.expiresAt) > new Date()) {
          this._session.set(session);
          this._currentUser.set(session.user);
          this._currentCompany.set(session.company);
          this._isAuthenticated.set(true);
        } else {
          this.clearSession();
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        this.clearSession();
      }
    }
  }

  /**
   * Realiza el login del usuario
   */
  public login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Simular delay de red
    return of(this.validateCredentials(credentials)).pipe(delay(1000));
  }

  /**
   * Valida las credenciales del usuario (mock)
   */
  private validateCredentials(credentials: LoginCredentials): LoginResponse {
    const company = this.mockCompanies.find(c => c.id === credentials.companyId);
    const user = this.mockUsers.find(u => u.username === credentials.username);

    if (!company) {
      return {
        success: false,
        error: 'Empresa no encontrada',
      };
    }

    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    // Mock password validation (en producción esto sería hash + salt)
    if (credentials.password !== 'password123') {
      return {
        success: false,
        error: 'Contraseña incorrecta',
      };
    }

    // Crear sesión
    const session: Session = {
      user,
      company,
      token: this.generateMockToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      permissions: this.getUserPermissions(user.role),
    };

    // Guardar sesión
    this._session.set(session);
    this._currentUser.set(user);
    this._currentCompany.set(company);
    this._isAuthenticated.set(true);

    // Persistir en localStorage
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    return {
      success: true,
      session,
      message: 'Login exitoso',
    };
  }

  /**
   * Genera un token mock (en producción sería JWT)
   */
  private generateMockToken(): string {
    return 'mock_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtiene permisos del usuario basado en su rol
   */
  private getUserPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['*'],
      manager: ['dashboard:read', 'reports:read', 'users:read', 'settings:read'],
      user: ['dashboard:read', 'reports:read'],
      viewer: ['dashboard:read'],
    };
    return permissions[role] || [];
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Limpia la sesión actual
   */
  private clearSession(): void {
    this._session.set(null);
    this._currentUser.set(null);
    this._currentCompany.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  public hasPermission(permission: string): boolean {
    const session = this._session();
    if (!session) return false;

    return session.permissions.includes('*') || session.permissions.includes(permission);
  }

  /**
   * Obtiene la lista de empresas disponibles
   */
  public getCompanies(): Observable<Company[]> {
    return of(this.mockCompanies).pipe(delay(500));
  }

  /**
   * Obtiene el usuario actual
   */
  public getCurrentUser(): User | null {
    return this._currentUser();
  }

  /**
   * Obtiene la empresa actual
   */
  public getCurrentCompany(): Company | null {
    return this._currentCompany();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  public getIsAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  /**
   * Refresca la sesión (extiende el tiempo de expiración)
   */
  public refreshSession(): void {
    const session = this._session();
    if (session) {
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }
}
