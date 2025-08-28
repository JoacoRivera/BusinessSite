import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

interface KPI {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface TableRow {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  customer: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // Signals para los datos del dashboard
  private readonly _kpis = signal<KPI[]>([]);
  private readonly _chartData = signal<ChartData | null>(null);
  private readonly _recentTransactions = signal<TableRow[]>([]);
  private readonly _isLoading = signal<boolean>(true);

  // Computed signals
  public readonly kpis = this._kpis.asReadonly();
  public readonly chartData = this._chartData.asReadonly();
  public readonly recentTransactions = this._recentTransactions.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  // Datos mock para el dashboard
  private readonly mockKPIs: KPI[] = [
    {
      title: 'Ventas Hoy',
      value: 'S/ 45,280',
      change: 12.5,
      changeType: 'positive',
      icon: '💰',
      color: 'success',
    },
    {
      title: 'Órdenes',
      value: 156,
      change: -2.3,
      changeType: 'negative',
      icon: '📋',
      color: 'warning',
    },
    {
      title: 'Ticket Promedio',
      value: 'S/ 290',
      change: 8.7,
      changeType: 'positive',
      icon: '📊',
      color: 'primary',
    },
    {
      title: 'Satisfacción',
      value: '4.8/5',
      change: 0.2,
      changeType: 'positive',
      icon: '⭐',
      color: 'accent',
    },
  ];

  private readonly mockChartData: ChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas 2024',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: 'rgba(63, 81, 181, 1)',
      },
      {
        label: 'Ventas 2023',
        data: [10000, 15000, 12000, 20000, 18000, 25000],
        backgroundColor: 'rgba(255, 64, 129, 0.2)',
        borderColor: 'rgba(255, 64, 129, 1)',
      },
    ],
  };

  private readonly mockTransactions: TableRow[] = [
    {
      id: 'TXN-001',
      type: 'Venta',
      amount: 1250.0,
      status: 'Completada',
      date: '2024-01-15',
      customer: 'Juan Pérez',
    },
    {
      id: 'TXN-002',
      type: 'Reembolso',
      amount: -450.0,
      status: 'Procesando',
      date: '2024-01-15',
      customer: 'María García',
    },
    {
      id: 'TXN-003',
      type: 'Venta',
      amount: 890.0,
      status: 'Completada',
      date: '2024-01-14',
      customer: 'Carlos López',
    },
    {
      id: 'TXN-004',
      type: 'Venta',
      amount: 2100.0,
      status: 'Pendiente',
      date: '2024-01-14',
      customer: 'Ana Rodríguez',
    },
    {
      id: 'TXN-005',
      type: 'Venta',
      amount: 675.0,
      status: 'Completada',
      date: '2024-01-13',
      customer: 'Luis Torres',
    },
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Carga los datos del dashboard
   */
  private loadDashboardData(): void {
    // Simular carga de datos
    setTimeout(() => {
      this._kpis.set(this.mockKPIs);
      this._chartData.set(this.mockChartData);
      this._recentTransactions.set(this.mockTransactions);
      this._isLoading.set(false);
    }, 1000);
  }

  /**
   * Obtiene la clase CSS para el tipo de cambio
   */
  public getChangeClass(changeType: string): string {
    switch (changeType) {
      case 'positive':
        return 'change-positive';
      case 'negative':
        return 'change-negative';
      default:
        return 'change-neutral';
    }
  }

  /**
   * Obtiene el ícono para el tipo de cambio
   */
  public getChangeIcon(changeType: string): string {
    switch (changeType) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '→';
    }
  }

  /**
   * Obtiene la clase CSS para el estado de la transacción
   */
  public getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completada':
        return 'status-completed';
      case 'pendiente':
        return 'status-pending';
      case 'procesando':
        return 'status-processing';
      default:
        return 'status-default';
    }
  }

  /**
   * Formatea el monto para mostrar
   */
  public formatAmount(amount: number): string {
    const currency = this.authService.getCurrentCompany()?.settings.currency || 'PEN';
    const symbol = currency === 'PEN' ? 'S/ ' : currency === 'USD' ? '$' : '€';

    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  }

  /**
   * Formatea la fecha para mostrar
   */
  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Refresca los datos del dashboard
   */
  public refreshDashboard(): void {
    this._isLoading.set(true);
    this.loadDashboardData();
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
}
