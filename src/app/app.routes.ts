import { Routes } from '@angular/router';
import { authGuard, loginGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('@core/layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Business Suite',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Configuración - Business Suite',
      },
      {
        path: 'modules',
        children: [
          {
            path: 'sales',
            loadComponent: () =>
              import('@features/modules/sales/sales.component').then(m => m.SalesComponent),
            title: 'Ventas - Business Suite',
          },
          {
            path: 'inventory',
            loadComponent: () =>
              import('@features/modules/inventory/inventory.component').then(
                m => m.InventoryComponent
              ),
            title: 'Inventario - Business Suite',
          },
          {
            path: 'customers',
            loadComponent: () =>
              import('@features/modules/customers/customers.component').then(
                m => m.CustomersComponent
              ),
            title: 'Clientes - Business Suite',
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('@features/modules/reports/reports.component').then(m => m.ReportsComponent),
            title: 'Reportes - Business Suite',
          },
          {
            path: 'finance',
            loadComponent: () =>
              import('@features/modules/finance/finance.component').then(m => m.FinanceComponent),
            title: 'Finanzas - Business Suite',
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
