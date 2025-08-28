import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h1>Módulo de Inventario</h1>
        <p>Gestión de productos, stock y almacenes</p>
      </div>
      <div class="module-content">
        <div class="placeholder-content">
          <span class="placeholder-icon">📦</span>
          <h2>Módulo en Desarrollo</h2>
          <p>Este módulo estará disponible en futuras versiones.</p>
          <div class="placeholder-features">
            <h3>Funcionalidades Planificadas:</h3>
            <ul>
              <li>Gestión de productos</li>
              <li>Control de stock</li>
              <li>Gestión de almacenes</li>
              <li>Alertas de inventario</li>
              <li>Reportes de stock</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .module-container {
        padding: var(--spacing-lg);
      }

      .module-header {
        margin-bottom: var(--spacing-xl);
        text-align: center;
      }

      .module-header h1 {
        color: var(--text);
        font-size: var(--font-size-3xl);
        margin-bottom: var(--spacing-sm);
      }

      .module-header p {
        color: var(--muted);
        font-size: var(--font-size-lg);
      }

      .placeholder-content {
        text-align: center;
        padding: var(--spacing-2xl);
        background-color: var(--surface);
        border-radius: var(--border-radius-lg);
        border: 2px dashed var(--border);
      }

      .placeholder-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
        display: block;
      }

      .placeholder-content h2 {
        color: var(--text);
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-md);
      }

      .placeholder-content p {
        color: var(--muted);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xl);
      }

      .placeholder-features {
        text-align: left;
        max-width: 400px;
        margin: 0 auto;
      }

      .placeholder-features h3 {
        color: var(--text);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-md);
      }

      .placeholder-features ul {
        color: var(--muted);
        font-size: var(--font-size-md);
        line-height: 1.6;
      }
    `,
  ],
})
export class InventoryComponent {}
