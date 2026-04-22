import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicamentoService } from '../../services/medicamento.service';
import { PresentacionService } from '../../services/presentacion.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Medicamento } from '../../models/medicamento.model';
import { Presentacion } from '../../models/presentacion.model';
import { Proveedor } from '../../models/proveedor.model';

@Component({
  selector: 'app-medicamentos',
  imports: [FormsModule],
  templateUrl: './medicamentos.html'
})
export class MedicamentosComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  presentaciones: Presentacion[] = [];
  proveedores: Proveedor[] = [];
  form: Partial<Medicamento> = { nombre: '', stock: 0, presentacionId: 0, proveedorId: 0 };
  editingId: number | null = null;
  showForm = false;

  constructor(
    private service: MedicamentoService,
    private presentacionService: PresentacionService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await Promise.all([this.load(), this.loadRelaciones()]);
  }

  async load() {
    this.medicamentos = await this.service.getAll();
    this.cdr.detectChanges();
  }

  async loadRelaciones() {
    [this.presentaciones, this.proveedores] = await Promise.all([
      this.presentacionService.getAll(),
      this.proveedorService.getAll()
    ]);
    this.cdr.detectChanges();
  }

  openForm() {
    this.form = { nombre: '', stock: 0, presentacionId: 0, proveedorId: 0 };
    this.editingId = null;
    this.showForm = true;
  }

  edit(item: Medicamento) {
    this.form = { ...item };
    this.editingId = item.id!;
    this.showForm = true;
  }

  async save() {
    if (!this.form.nombre?.trim() || !this.form.presentacionId || !this.form.proveedorId) return;
    const data = {
      nombre: this.form.nombre!,
      stock: this.form.stock ?? 0,
      presentacionId: Number(this.form.presentacionId),
      proveedorId: Number(this.form.proveedorId)
    };
    if (this.editingId) {
      await this.service.update({ id: this.editingId, ...data });
    } else {
      await this.service.add(data);
    }
    this.showForm = false;
    await this.load();
  }

  async delete(id: number) {
    if (confirm('¿Eliminar este medicamento?')) {
      await this.service.delete(id);
      await this.load();
    }
  }

  cancel() { this.showForm = false; }

  getPresentacion(id: number): string {
    return this.presentaciones.find(p => p.id === id)?.nombre ?? '—';
  }

  getProveedor(id: number): string {
    return this.proveedores.find(p => p.id === id)?.nombre ?? '—';
  }
}
