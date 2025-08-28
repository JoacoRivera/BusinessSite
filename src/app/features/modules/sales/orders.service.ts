import { Injectable, signal } from '@angular/core';

export interface OrderItem {
  product: string;
  qty: number;
  price: number;
  weight?: number; // kg
  igv?: number; // tax amount
}

export interface Order {
  id: string;
  customer: string;
  date: string; // ISO
  items: OrderItem[];
  total: number;
  status: 'Completada' | 'Pendiente' | 'Procesando' | 'Cancelada';
  billingStatus?: 'Facturada' | 'Pendiente' | 'Parcial';
  carrier?: string;
  deliveryStatus?: 'En preparación' | 'Enviado' | 'En tránsito' | 'Entregado';
  ref?: string; // quote reference
  responsible?: string; // user id/name
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private _orders = signal<Order[]>([]);
  public orders = this._orders.asReadonly();

  constructor() {
    // Seed with sample data
    const seed: Order[] = Array.from({ length: 12 }).map((_, i) => {
      const items = [
        {
          product: `Producto ${i + 1}`,
          qty: (i % 3) + 1,
          price: 120 + i * 5,
          weight: ((i % 3) + 1) * 0.5,
          igv: 0,
        },
      ];
      const total = items.reduce((s, it) => s + it.qty * it.price, 0);
      return {
        id: `ORD-${1000 + i}`,
        customer: `Cliente ${i + 1}`,
        date: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
        items,
        total,
        status: ['Completada', 'Pendiente', 'Procesando'][i % 3] as Order['status'],
        billingStatus: i % 2 === 0 ? 'Facturada' : 'Pendiente',
        carrier: i % 2 === 0 ? 'DHL' : 'FedEx',
        deliveryStatus: i % 3 === 0 ? 'Entregado' : i % 3 === 1 ? 'Enviado' : 'En preparación',
        ref: i % 2 === 0 ? 'Q-1001' : undefined,
        responsible: `User ${(i % 4) + 1}`,
      };
    });

    this._orders.set(seed);
  }

  list(): Order[] {
    return this._orders();
  }

  get(id: string): Order | undefined {
    return this._orders().find(o => o.id === id);
  }

  create(order: Order) {
    this._orders.update(current => [order, ...current]);
  }

  update(id: string, patch: Partial<Order>) {
    this._orders.update(current => current.map(o => (o.id === id ? { ...o, ...patch } : o)));
  }

  delete(id: string) {
    this._orders.update(current => current.filter(o => o.id !== id));
  }
}
