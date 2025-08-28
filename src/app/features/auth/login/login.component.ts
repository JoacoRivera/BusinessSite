import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Company } from '@core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  // Signals para el estado del componente
  private readonly _isLoading = signal<boolean>(false);
  private readonly _errorMessage = signal<string>('');
  private readonly _companies = signal<Company[]>([]);

  // Computed signals
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();
  public readonly companies = this._companies.asReadonly();

  // Formulario de login
  public loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      companyId: ['', [Validators.required]],
    });

    this.loadCompanies();
  }

  /**
   * Carga la lista de empresas disponibles
   */
  private loadCompanies(): void {
    this.authService.getCompanies().subscribe({
      next: companies => {
        this._companies.set(companies);
        // Seleccionar la primera empresa por defecto
        if (companies.length > 0) {
          this.loginForm.patchValue({ companyId: companies[0].id });
        }
      },
      error: error => {
        console.error('Error loading companies:', error);
        this._errorMessage.set('Error al cargar las empresas');
      },
    });
  }

  /**
   * Maneja el envío del formulario de login
   */
  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this._isLoading.set(true);
    this._errorMessage.set('');

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: response => {
        if (response.success && response.session) {
          // Obtener la URL de retorno o ir al dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([returnUrl]);
        } else {
          this._errorMessage.set(response.error || 'Error en el login');
        }
      },
      error: error => {
        console.error('Login error:', error);
        this._errorMessage.set('Error de conexión. Intente nuevamente.');
      },
      complete: () => {
        this._isLoading.set(false);
      },
    });
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene errores
   */
  public hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  public getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Este campo es requerido';
    }

    if (field.errors['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene el nombre de la empresa por ID
   */
  public getCompanyName(companyId: string): string {
    const company = this.companies().find(c => c.id === companyId);
    return company?.name || '';
  }

  /**
   * Obtiene el código de la empresa por ID
   */
  public getCompanyCode(companyId: string): string {
    const company = this.companies().find(c => c.id === companyId);
    return company?.code || '';
  }

  /**
   * Limpia el mensaje de error
   */
  public clearError(): void {
    this._errorMessage.set('');
  }
}
