# Business Suite - Angular 20

Una suite de negocios moderna y escalable construida con Angular 20, diseñada para proporcionar una base sólida para aplicaciones empresariales.

## 🚀 Características

- **Arquitectura Moderna**: Componentes standalone, signals, y routing lazy-loaded
- **Sistema de Temas**: Soporte completo para modo claro/oscuro con CSS variables
- **Autenticación**: Sistema de autenticación mock con guards y interceptors
- **Layout Responsivo**: Sidebar colapsable y topbar con navegación persistente
- **Dashboard Interactivo**: KPIs, gráficos y tablas de datos mock
- **Configuración Avanzada**: Página de settings con múltiples opciones
- **Accesibilidad**: Cumple estándares WCAG con aria-labels y roles
- **Internacionalización**: Preparado para i18n con soporte multi-idioma
- **Testing**: Configuración de pruebas con Jasmine y Karma

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios y componentes core
│   │   ├── guards/             # Guards de autenticación
│   │   ├── layout/             # Layout principal (sidebar + topbar)
│   │   ├── models/             # Interfaces y modelos de datos
│   │   └── services/           # Servicios principales
│   ├── features/               # Módulos de características
│   │   ├── auth/               # Autenticación y login
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── settings/           # Configuración del sistema
│   │   └── modules/            # Módulos de negocio (placeholders)
│   ├── shared/                 # Componentes y utilidades compartidas
│   ├── theme/                  # Sistema de temas y estilos
│   └── environments/           # Configuración por ambiente
├── assets/                     # Recursos estáticos
└── styles.scss                 # Estilos globales y variables CSS
```

## 🎨 Sistema de Temas

El proyecto utiliza CSS variables para un sistema de temas dinámico:

- **Variables de Color**: `--primary`, `--accent`, `--success`, `--warning`, `--error`
- **Variables de Espaciado**: `--spacing-xs` a `--spacing-2xl`
- **Variables de Tipografía**: `--font-size-xs` a `--font-size-3xl`
- **Variables de Sombras**: `--shadow-sm` a `--shadow-xl`
- **Transiciones**: `--transition-fast`, `--transition-normal`, `--transition-slow`

### Cambio de Tema

```typescript
// En cualquier componente
constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggle();
}

enableDark() {
  this.themeService.enableDark();
}

enableLight() {
  this.themeService.enableLight();
}
```

## 🔐 Sistema de Autenticación

### Credenciales de Demo

- **Usuario**: `admin`, `manager`, o `user`
- **Contraseña**: `password123`
- **Empresa**: Seleccionar cualquiera de las opciones disponibles

### Estructura de Usuarios

- **Admin**: Acceso completo a todas las funcionalidades
- **Manager**: Acceso a dashboard, reportes, usuarios y configuración
- **User**: Acceso básico a dashboard y reportes

### Implementación de Guards

```typescript
// Proteger rutas
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}

// Prevenir acceso a login si ya está autenticado
{
  path: 'login',
  component: LoginComponent,
  canActivate: [loginGuard]
}
```

## 📱 Layout y Navegación

### MainLayoutComponent

- **Sidebar**: Navegación principal con módulos de negocio
- **Topbar**: Búsqueda, notificaciones, perfil de usuario y toggle de tema
- **Responsivo**: Se colapsa automáticamente en dispositivos móviles

### Navegación

- **Dashboard**: Vista principal con KPIs y métricas
- **Módulos**: Ventas, Inventario, Clientes, Reportes, Finanzas
- **Settings**: Configuración del sistema y preferencias

## 📊 Dashboard

### KPIs Principales

- **Ventas Hoy**: Monto total de ventas del día
- **Órdenes**: Número total de órdenes
- **Ticket Promedio**: Valor promedio por transacción
- **Satisfacción**: Puntuación de satisfacción del cliente

### Gráficos

- **Ventas Mensuales**: Comparación año actual vs anterior
- **Tendencias**: Análisis de patrones de ventas

### Tablas de Datos

- **Transacciones Recientes**: Últimas operaciones del sistema
- **Estados**: Completada, Pendiente, Procesando

## ⚙️ Configuración

### Secciones Disponibles

1. **Apariencia**: Modo oscuro, compacto, animaciones
2. **Usuarios & Roles**: Gestión de usuarios y permisos
3. **Notificaciones**: Preferencias de notificaciones
4. **Localización**: Idioma, zona horaria, moneda
5. **Integraciones**: APIs, webhooks, servicios externos
6. **Preferencias**: Exportación, respaldo, mantenimiento

### Implementación de Configuraciones

```typescript
// Ejemplo de configuración
{
  id: 'darkMode',
  label: 'Modo Oscuro',
  description: 'Cambiar entre tema claro y oscuro',
  type: 'toggle',
  value: false,
  action: () => this.toggleDarkMode()
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm 9+ o yarn 1.22+
- Angular CLI 20+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd business-suite

# Instalar dependencias
npm install

# Instalar Husky para pre-commit hooks
npm run prepare
```

### Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run build          # Build de producción
npm run watch          # Build en modo watch

# Testing
npm test               # Ejecutar pruebas
npm run test:watch     # Pruebas en modo watch

# Linting y Formateo
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Corregir errores automáticamente
npm run format         # Formatear código con Prettier

# Build y Deploy
npm run build:prod     # Build optimizado para producción
```

### Configuración de Entornos

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Business Suite',
  version: '1.0.0',
  defaultLocale: 'es-PE'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.businesssuite.com/api',
  // ... otras configuraciones
};
```

## 🧪 Testing

### Configuración de Pruebas

- **Framework**: Jasmine + Karma
- **Coverage**: Reportes de cobertura automáticos
- **E2E**: Preparado para Cypress o Playwright

### Ejecutar Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas con coverage
npm run test:coverage

# Pruebas en modo watch
npm run test:watch
```

## 📦 Estructura de Módulos

### Módulos de Negocio (Placeholders)

- **Ventas**: Gestión de pedidos y facturación
- **Inventario**: Control de stock y productos
- **Clientes**: CRM y gestión de relaciones
- **Reportes**: Análisis y métricas
- **Finanzas**: Contabilidad y flujo de caja

### Extensión de Módulos

```typescript
// Ejemplo de nuevo módulo
@Component({
  selector: 'app-new-module',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: [`...`]
})
export class NewModuleComponent {}

// Agregar a las rutas
{
  path: 'modules/new-module',
  component: NewModuleComponent,
  title: 'Nuevo Módulo - Business Suite'
}
```

## 🔧 Configuración de Linting

### ESLint

- **Reglas Estrictas**: TypeScript con reglas estrictas
- **Angular**: Reglas específicas para Angular
- **Accesibilidad**: Reglas de accesibilidad automáticas

### Prettier

- **Formateo Automático**: Al guardar archivos
- **Configuración Consistente**: Espaciado, comillas, etc.
- **Integración con ESLint**: Sin conflictos

## 🌐 Internacionalización (i18n)

### Configuración Base

- **Idioma Principal**: Español (Perú) - `es-PE`
- **Idiomas Soportados**: `es-PE`, `en-US`, `es-ES`
- **Archivos de Traducción**: Preparados para ngx-translate

### Implementación

```typescript
// Ejemplo de uso
{
  id: 'language',
  label: 'Idioma',
  description: 'Seleccionar idioma de la aplicación',
  type: 'select',
  value: 'es-PE',
  options: [
    { value: 'es-PE', label: 'Español (Perú)' },
    { value: 'en-US', label: 'English (US)' }
  ]
}
```

## 📱 Responsividad

### Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Características

- **Sidebar Colapsable**: Se oculta automáticamente en móviles
- **Grid Responsivo**: KPIs y módulos se adaptan al viewport
- **Touch Friendly**: Botones y controles optimizados para touch

## ♿ Accesibilidad

### Características Implementadas

- **ARIA Labels**: Etiquetas descriptivas para elementos interactivos
- **Roles Semánticos**: `navigation`, `main`, `table`, etc.
- **Focus Visible**: Indicadores claros de focus
- **Contraste**: Cumple estándares WCAG AA
- **Navegación por Teclado**: Soporte completo para navegación sin mouse

### Ejemplos de Uso

```html
<!-- Navegación accesible -->
<nav role="navigation" aria-label="Navegación principal">
  <ul class="nav-list">
    <li class="nav-item">
      <a class="nav-link" 
         [routerLink]="item.route" 
         [attr.aria-label]="item.label">
        {{ item.label }}
      </a>
    </li>
  </ul>
</nav>

<!-- Tabla accesible -->
<table class="transactions-table" 
       role="table" 
       aria-label="Transacciones recientes">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <!-- ... otras columnas -->
    </tr>
  </thead>
</table>
```

## 🚀 Despliegue

### Build de Producción

```bash
# Build optimizado
npm run build:prod

# Los archivos se generan en dist/business-suite/
```

### Configuración de Servidor

- **SPA Routing**: Configurar servidor para manejar rutas de Angular
- **Compresión**: Habilitar gzip/brotli
- **Cache**: Headers de cache apropiados para assets estáticos

### Variables de Entorno

```bash
# .env.production
API_URL=https://api.businesssuite.com/api
ENVIRONMENT=production
ENABLE_ANALYTICS=true
```

## 🔄 Migración de Mocks a Servicios Reales

### AuthService

```typescript
// Actual: Mock data
private readonly mockUsers: User[] = [...];

// Futuro: API real
public login(credentials: LoginCredentials): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
}
```

### Dashboard Data

```typescript
// Actual: Mock KPIs
private readonly mockKPIs: KPI[] = [...];

// Futuro: API real
public getKPIs(): Observable<KPI[]> {
  return this.http.get<KPI[]>(`${this.apiUrl}/dashboard/kpis`);
}
```

### Theme Service

```typescript
// Actual: localStorage
localStorage.setItem(this.THEME_KEY, themeName);

// Futuro: API + localStorage
public setTheme(themeName: Theme['name']): void {
  // Guardar en API
  this.http.post(`${this.apiUrl}/user/preferences/theme`, { theme: themeName })
    .subscribe();
  
  // Aplicar localmente
  this.applyTheme(themeName);
}
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de Paths**: Verificar configuración en `tsconfig.json`
2. **Linting Errors**: Ejecutar `npm run lint:fix`
3. **Build Errors**: Limpiar `node_modules` y reinstalar
4. **Routing Issues**: Verificar configuración de rutas lazy-loaded

### Logs y Debugging

```typescript
// Habilitar logs detallados
console.log('Auth State:', this.authService.isAuthenticated());
console.log('Theme State:', this.themeService.getCurrentTheme());
console.log('User Info:', this.authService.getCurrentUser());
```

## 🤝 Contribución

### Guías de Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

### Estándares de Código

- **TypeScript**: Usar tipos estrictos
- **Angular**: Seguir guías de estilo oficiales
- **Testing**: Mantener cobertura > 80%
- **Documentación**: Comentar código complejo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: Crear issue en GitHub
- **Documentación**: Revisar este README y comentarios en código
- **Comunidad**: Angular Discord o Stack Overflow

## 🔮 Roadmap

### Versión 1.1
- [ ] Integración con APIs reales
- [ ] Sistema de notificaciones push
- [ ] Reportes avanzados con gráficos reales

### Versión 1.2
- [ ] Módulo de ventas funcional
- [ ] Sistema de permisos granular
- [ ] Auditoría y logs del sistema

### Versión 2.0
- [ ] Módulos de negocio completos
- [ ] API REST completa
- [ ] Sistema de plugins/módulos

---

**Business Suite** - Construido con ❤️ usando Angular 20
