import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { OrdersService, Order, OrderItem } from './orders.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private fb = inject(FormBuilder);

  public orders = signal<Order[]>([]);
  // temporary items used inside the modal for orders
  public modalItems = signal<OrderItem[]>([]);
  // small mock lists
  public clients = signal<{ id: string; name: string }[]>([
    { id: 'CL-001', name: 'ACME Corp' },
    { id: 'CL-002', name: 'Globex' },
    { id: 'CL-003', name: 'Umbrella' },
  ]);

  public transportistas = signal<{ id: string; name: string }[]>([
    { id: 'T-1', name: 'DHL' },
    { id: 'T-2', name: 'FedEx' },
    { id: 'T-3', name: 'Serpost' },
  ]);
  public showModal = signal(false);
  public editing = signal<Order | null>(null);
  public form!: FormGroup;
  // which resource the modal is editing/creating
  public editingView = signal<
    'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards' | null
  >(null);

  // View state: orders, quotes, contracts, delivery, invoices, notes, dashboards
  public currentView = signal<
    'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards'
  >('orders');

  // Simple mock types for the additional views
  // (kept minimal for the mockup)
  public quotes = signal<
    {
      id: string;
      customer: string;
      date: string;
      total: number;
      status: string;
    }[]
  >([
    { id: 'Q-1001', customer: 'ACME Corp', date: '2025-07-01', total: 4500, status: 'Enviada' },
    { id: 'Q-1002', customer: 'Globex', date: '2025-07-15', total: 12900, status: 'Aceptada' },
  ]);

  public contracts = signal<
    {
      id: string;
      party: string;
      start: string;
      end: string;
      value: number;
      status: string;
    }[]
  >([
    {
      id: 'C-2025-01',
      party: 'ACME Corp',
      start: '2025-01-01',
      end: '2026-01-01',
      value: 120000,
      status: 'Activo',
    },
    {
      id: 'C-2024-08',
      party: 'Initech',
      start: '2024-08-01',
      end: '2025-08-01',
      value: 54000,
      status: 'Expirado',
    },
  ]);

  public deliveries = signal<
    {
      id: string;
      orderId: string;
      date: string;
      carrier: string;
      status: string;
    }[]
  >([
    { id: 'D-9001', orderId: 'ORD-1001', date: '2025-08-01', carrier: 'DHL', status: 'Enviado' },
    {
      id: 'D-9002',
      orderId: 'ORD-1002',
      date: '2025-08-03',
      carrier: 'FedEx',
      status: 'Entregado',
    },
  ]);

  public invoices = signal<
    {
      id: string;
      customer: string;
      date: string;
      amount: number;
      status: string;
    }[]
  >([
    { id: 'INV-5001', customer: 'ACME Corp', date: '2025-07-02', amount: 4500, status: 'Pagada' },
    { id: 'INV-5002', customer: 'Globex', date: '2025-07-16', amount: 12900, status: 'Pendiente' },
  ]);

  public notes = signal<
    {
      id: string;
      type: 'Credit' | 'Debit';
      ref: string;
      date: string;
      amount: number;
      status: string;
    }[]
  >([
    {
      id: 'CN-3001',
      type: 'Credit',
      ref: 'INV-5001',
      date: '2025-07-10',
      amount: 150,
      status: 'Emitida',
    },
    {
      id: 'DN-3002',
      type: 'Debit',
      ref: 'INV-5002',
      date: '2025-07-20',
      amount: 75,
      status: 'Aplicada',
    },
  ]);

  // Chart data
  public chartLabels: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  public chartData = signal<number[]>([12000, 19000, 15000, 25000, 22000, 30000]);
  // Per-view chart data (mocked)
  public viewCharts = {
    orders: [12000, 19000, 15000, 25000, 22000, 30000],
    quotes: [4000, 6000, 3200, 4800, 5200, 6100],
    contracts: [30000, 28000, 32000, 31000, 33000, 34000],
    delivery: [50, 43, 70, 60, 75, 80],
    invoices: [11000, 13000, 9000, 15000, 14000, 16000],
    notes: [2, 3, 1, 4, 2, 3],
    dashboards: [0, 0, 0, 0, 0, 0],
  } as const;

  ngOnInit(): void {
    this.orders.set(this.ordersService.list());
    this.form = this.fb.group({
      id: [''],
      // common fields
      customer: [''],
      party: [''],
      date: [new Date().toISOString().slice(0, 10)],
      start: [''],
      end: [''],
      total: [0],
      value: [0],
      amount: [0],
      status: [''],
      billingStatus: [''],
      responsible: [''],
      carrier: [''],
      deliveryStatus: [''],
      orderId: [''],
      type: ['Credit'],
      ref: [''],
    });
  }

  getCreateLabel() {
    const map: Record<string, string> = {
      orders: 'Crear Pedido',
      quotes: 'Crear Cotización',
      contracts: 'Crear Contrato',
      delivery: 'Crear Entrega',
      invoices: 'Crear Factura',
      notes: 'Crear Nota',
      dashboards: 'Nuevo Reporte',
    };
    return map[this.currentView()];
  }

  // Generic create action that creates a minimal record for the active view
  createForCurrentView() {
    // open modal to create for the current view
    const v = this.currentView();
    this.openCreate(v);
  }

  // open create modal for given view (defaults to current view)
  openCreate(
    view?: 'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards'
  ) {
    const v = view ?? this.currentView();
    this.editing.set(null);
    this.editingView.set(v);
    const prefixMap: Record<string, string> = {
      orders: 'ORD',
      quotes: 'Q',
      contracts: 'C',
      delivery: 'D',
      invoices: 'INV',
      notes: 'N',
      dashboards: 'R',
    };
    const id = `${prefixMap[v]}-${Math.floor(Math.random() * 9000 + 1000)}`;
    // reset form with defaults per view
    this.form.reset({
      id,
      customer: v === 'orders' || v === 'quotes' || v === 'invoices' ? '' : '',
      party: v === 'contracts' ? '' : '',
      date: new Date().toISOString().slice(0, 10),
      start: v === 'contracts' ? new Date().toISOString().slice(0, 10) : '',
      end: v === 'contracts' ? new Date(Date.now() + 31536000000).toISOString().slice(0, 10) : '',
      total: 0,
      value: 0,
      amount: 0,
      status: v === 'orders' ? 'Pendiente' : v === 'invoices' ? 'Pendiente' : 'Enviada',
      carrier: '',
      billingStatus: 'Pendiente',
      responsible: '',
      deliveryStatus: 'En preparación',
      orderId: '',
      type: 'Credit',
      ref: '',
    });
    // reset modal items for order creation
    this.modalItems.set([]);
    this.showModal.set(true);
  }

  // Generic delete helper for mock signals
  deleteFor(view: string, id: string) {
    if (view === 'orders') {
      this.remove(id);
      return;
    }
    if (view === 'quotes') {
      this.quotes.update(qs => qs.filter(q => q.id !== id));
      return;
    }
    if (view === 'contracts') {
      this.contracts.update(cs => cs.filter(c => c.id !== id));
      return;
    }
    if (view === 'delivery') {
      this.deliveries.update(ds => ds.filter(d => d.id !== id));
      return;
    }
    if (view === 'invoices') {
      this.invoices.update(is => is.filter(i => i.id !== id));
      return;
    }
    if (view === 'notes') {
      this.notes.update(ns => ns.filter(n => n.id !== id));
      return;
    }
  }

  // Generic edit/view placeholder that for orders re-uses the modal; for others, opens a prompt (mock)
  viewOrEdit(view: string, id: string, mode: 'view' | 'edit') {
    if (view === 'orders') {
      const o = this.orders().find(x => x.id === id);
      if (!o) return;
      if (mode === 'edit') {
        this.openEdit(o);
        return;
      }
      // view mode for orders: reuse modal populated in read-only form
      this.openEdit(o);
      return;
    }
    // for other views, open modal edit/view
    type Item =
      | {
          id: string;
          customer?: string;
          party?: string;
          status?: string;
          carrier?: string;
          ref?: string;
        }
      | { id: string };
    const list: Item[] =
      (view === 'quotes' && this.quotes()) ||
      (view === 'contracts' && this.contracts()) ||
      (view === 'delivery' && this.deliveries()) ||
      (view === 'invoices' && this.invoices()) ||
      (view === 'notes' && this.notes()) ||
      [];
    const item = list.find(i => i.id === id) as Item | undefined;
    if (!item) return;
    if (mode === 'view') {
      // open modal in view mode
      this.openEditGeneric(
        view as
          | 'orders'
          | 'quotes'
          | 'contracts'
          | 'delivery'
          | 'invoices'
          | 'notes'
          | 'dashboards',
        id
      );
      return;
    }
    // edit: open modal editor
    this.openEditGeneric(
      view as 'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards',
      id
    );
    return;
  }

  openEditGeneric(
    view: 'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards',
    id: string
  ) {
    this.editingView.set(view);
    if (view === 'quotes') {
      const q = this.quotes().find(x => x.id === id);
      if (!q) return;
      this.form.reset({
        id: q.id,
        customer: q.customer,
        date: q.date,
        total: q.total,
        status: q.status,
      });
      this.showModal.set(true);
      return;
    }
    if (view === 'contracts') {
      const c = this.contracts().find(x => x.id === id);
      if (!c) return;
      this.form.reset({
        id: c.id,
        party: c.party,
        start: c.start,
        end: c.end,
        value: c.value,
        status: c.status,
      });
      this.showModal.set(true);
      return;
    }
    if (view === 'delivery') {
      const d = this.deliveries().find(x => x.id === id);
      if (!d) return;
      this.form.reset({
        id: d.id,
        orderId: d.orderId,
        date: d.date,
        carrier: d.carrier,
        status: d.status,
      });
      this.showModal.set(true);
      return;
    }
    if (view === 'invoices') {
      const i = this.invoices().find(x => x.id === id);
      if (!i) return;
      this.form.reset({
        id: i.id,
        customer: i.customer,
        date: i.date,
        amount: i.amount,
        status: i.status,
      });
      this.showModal.set(true);
      return;
    }
    if (view === 'notes') {
      const n = this.notes().find(x => x.id === id);
      if (!n) return;
      this.form.reset({
        id: n.id,
        type: n.type,
        ref: n.ref,
        date: n.date,
        amount: n.amount,
        status: n.status,
      });
      this.showModal.set(true);
      return;
    }
  }

  setView(
    view: 'orders' | 'quotes' | 'contracts' | 'delivery' | 'invoices' | 'notes' | 'dashboards'
  ) {
    this.currentView.set(view);
  }

  openEdit(order: Order) {
    this.editing.set(order);
    this.editingView.set('orders');
    this.form.setValue({
      id: order.id,
      customer: order.customer,
      party: '',
      date: order.date.slice(0, 10),
      start: '',
      end: '',
      total: order.total,
      value: 0,
      amount: 0,
      status: order.status,
      carrier: order.carrier ?? '',
      deliveryStatus: order.deliveryStatus ?? 'En preparación',
      orderId: '',
      billingStatus: order.billingStatus ?? '',
      responsible: order.responsible ?? '',
      type: 'Credit',
      ref: '',
    });
    // populate modal items from the editing order
    this.modalItems.set(order.items ? [...order.items] : []);
    this.showModal.set(true);
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const view = this.editingView() ?? this.currentView();
    if (view === 'orders') {
      // compute item-level igv if missing and totals
      const items = this.modalItems().map(it => {
        const qty = +it.qty || 0;
        const price = +it.price || 0;
        const line = qty * price;
        const igv = typeof it.igv === 'number' ? it.igv : Math.round(line * 0.18 * 100) / 100;
        return { ...it, qty, price, igv } as OrderItem;
      });
      const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
      const totalIgv = items.reduce((s, i) => s + (i.igv || 0), 0);
      const total = Math.round((subtotal + totalIgv) * 100) / 100;

      const payload: Order = {
        id: v.id,
        customer: v.customer,
        date: v.date,
        items,
        total,
        status: v.status,
        carrier: v.carrier,
        billingStatus: v.billingStatus,
        ref: v.ref,
        responsible: v.responsible,
      };

      if (this.editing()) this.ordersService.update(payload.id, payload);
      else this.ordersService.create(payload);
      this.orders.set(this.ordersService.list());
      this.showModal.set(false);
      this.editingView.set(null);
      return;
    }
    if (view === 'quotes') {
      const exists = this.quotes().some(q => q.id === v.id);
      if (exists)
        this.quotes.update(qs =>
          qs.map(q =>
            q.id === v.id
              ? { ...q, customer: v.customer, date: v.date, total: +v.total, status: v.status }
              : q
          )
        );
      else
        this.quotes.update(qs => [
          { id: v.id, customer: v.customer, date: v.date, total: +v.total, status: v.status },
          ...qs,
        ]);
    }
    if (view === 'contracts') {
      const exists = this.contracts().some(c => c.id === v.id);
      if (exists)
        this.contracts.update(cs =>
          cs.map(c =>
            c.id === v.id
              ? {
                  ...c,
                  party: v.party,
                  start: v.start,
                  end: v.end,
                  value: +v.value,
                  status: v.status,
                }
              : c
          )
        );
      else
        this.contracts.update(cs => [
          {
            id: v.id,
            party: v.party,
            start: v.start,
            end: v.end,
            value: +v.value,
            status: v.status,
          },
          ...cs,
        ]);
    }
    if (view === 'delivery') {
      const exists = this.deliveries().some(d => d.id === v.id);
      if (exists)
        this.deliveries.update(ds =>
          ds.map(d =>
            d.id === v.id
              ? { ...d, orderId: v.orderId, date: v.date, carrier: v.carrier, status: v.status }
              : d
          )
        );
      else
        this.deliveries.update(ds => [
          { id: v.id, orderId: v.orderId, date: v.date, carrier: v.carrier, status: v.status },
          ...ds,
        ]);
    }
    if (view === 'invoices') {
      const exists = this.invoices().some(i => i.id === v.id);
      if (exists)
        this.invoices.update(is =>
          is.map(i =>
            i.id === v.id
              ? { ...i, customer: v.customer, date: v.date, amount: +v.amount, status: v.status }
              : i
          )
        );
      else
        this.invoices.update(is => [
          { id: v.id, customer: v.customer, date: v.date, amount: +v.amount, status: v.status },
          ...is,
        ]);
    }
    if (view === 'notes') {
      const exists = this.notes().some(n => n.id === v.id);
      if (exists)
        this.notes.update(ns =>
          ns.map(n =>
            n.id === v.id
              ? {
                  ...n,
                  type: v.type,
                  ref: v.ref,
                  date: v.date,
                  amount: +v.amount,
                  status: v.status,
                }
              : n
          )
        );
      else
        this.notes.update(ns => [
          { id: v.id, type: v.type, ref: v.ref, date: v.date, amount: +v.amount, status: v.status },
          ...ns,
        ]);
    }
    this.showModal.set(false);
    this.editingView.set(null);
  }

  // compute a modal title based on the editingView/currentView and mode
  modalTitle() {
    const v = this.editingView() ?? this.currentView();
    const mode = this.editing() ? 'Editar' : 'Crear';
    const map: Record<string, string> = {
      orders: 'Pedido',
      quotes: 'Cotización',
      contracts: 'Contrato',
      delivery: 'Entrega',
      invoices: 'Factura',
      notes: 'Nota',
      dashboards: 'Reporte',
    };
    return `${mode} ${map[v as string] ?? ''}`;
  }

  // Returns an array of { label, value } for the summary panel based on the current view
  summaryForCurrentView() {
    const v = this.currentView();
    if (v === 'orders') {
      const total = this.orders().length;
      const pending = this.orders().filter(o => o.status === 'Pendiente').length;
      const completed = this.orders().filter(o => o.status === 'Completada').length;
      const amount = this.orders().reduce((s, o) => s + (o.total || 0), 0);
      return [
        { label: 'Total', value: total },
        { label: 'Pendientes', value: pending },
        { label: 'Completadas', value: completed },
        { label: 'Ingresos', value: `S/ ${amount.toLocaleString()}` },
      ];
    }
    if (v === 'quotes') {
      const total = this.quotes().length;
      const sent = this.quotes().filter(q => q.status === 'Enviada').length;
      const accepted = this.quotes().filter(q => q.status === 'Aceptada').length;
      const amount = this.quotes().reduce((s, q) => s + (q.total || 0), 0);
      return [
        { label: 'Total', value: total },
        { label: 'Enviadas', value: sent },
        { label: 'Aceptadas', value: accepted },
        { label: 'Valor total', value: `S/ ${amount.toLocaleString()}` },
      ];
    }
    if (v === 'contracts') {
      const total = this.contracts().length;
      const active = this.contracts().filter(c => c.status === 'Activo').length;
      const expired = this.contracts().filter(c => c.status === 'Expirado').length;
      const value = this.contracts().reduce((s, c) => s + (c.value || 0), 0);
      return [
        { label: 'Total', value: total },
        { label: 'Activos', value: active },
        { label: 'Expirados', value: expired },
        { label: 'Valor total', value: `S/ ${value.toLocaleString()}` },
      ];
    }
    if (v === 'delivery') {
      const total = this.deliveries().length;
      const sent = this.deliveries().filter(d => d.status === 'Enviado').length;
      const delivered = this.deliveries().filter(d => d.status === 'Entregado').length;
      return [
        { label: 'Total', value: total },
        { label: 'Enviadas', value: sent },
        { label: 'Entregadas', value: delivered },
      ];
    }
    if (v === 'invoices') {
      const total = this.invoices().length;
      const paid = this.invoices().filter(i => i.status === 'Pagada').length;
      const pending = this.invoices().filter(i => i.status === 'Pendiente').length;
      const amount = this.invoices().reduce((s, i) => s + (i.amount || 0), 0);
      return [
        { label: 'Total', value: total },
        { label: 'Pagadas', value: paid },
        { label: 'Pendientes', value: pending },
        { label: 'Importe total', value: `S/ ${amount.toLocaleString()}` },
      ];
    }
    if (v === 'notes') {
      const total = this.notes().length;
      const credits = this.notes().filter(n => n.type === 'Credit').length;
      const debits = this.notes().filter(n => n.type === 'Debit').length;
      const amount = this.notes().reduce((s, n) => s + (n.amount || 0), 0);
      return [
        { label: 'Total', value: total },
        { label: 'Créditos', value: credits },
        { label: 'Débitos', value: debits },
        { label: 'Importe', value: `S/ ${amount.toLocaleString()}` },
      ];
    }
    // dashboards
    return [
      { label: 'Ingresos', value: 'S/ 1,240,560' },
      { label: 'Crecimiento', value: '+12.4%' },
      { label: 'Pedidos/día', value: '321' },
    ];
  }

  remove(id: string) {
    this.ordersService.delete(id);
    this.orders.set(this.ordersService.list());
  }

  closeModal() {
    this.showModal.set(false);
  }

  // Modal item CRUD helpers
  addItem(item?: Partial<OrderItem>) {
    const it: OrderItem = {
      product: item?.product ?? 'Nuevo ítem',
      qty: item?.qty ?? 1,
      price: item?.price ?? 0,
      weight: item?.weight ?? 0,
      igv: item?.igv,
    };
    this.modalItems.update(arr => [it, ...arr]);
  }

  updateItem(index: number, patch: Partial<OrderItem>) {
    this.modalItems.update(arr => {
      const copy = [...arr];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  }

  removeItem(index: number) {
    this.modalItems.update(arr => arr.filter((_, i) => i !== index));
  }

  // computed totals from modal items
  get modalSubtotal() {
    return this.modalItems().reduce((s, i) => s + (i.qty || 0) * (i.price || 0), 0);
  }

  get modalTotalIgv() {
    return this.modalItems().reduce(
      (s, i) => s + (i.igv || Math.round((i.qty || 0) * (i.price || 0) * 0.18 * 100) / 100),
      0
    );
  }

  get modalTotalWeight() {
    return this.modalItems().reduce((s, i) => s + (i.weight || 0), 0);
  }
}
