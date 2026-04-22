import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor.model';

@Component({
  selector: 'app-proveedores',
  imports: [FormsModule],
  templateUrl: './proveedores.html'
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  form: Partial<Proveedor> = { nombre: '', telefono: '' };
  editingId: number | null = null;
  showForm = false;

  constructor(private service: ProveedorService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  async load() {
    this.proveedores = await this.service.getAll();
    this.cdr.detectChanges();
  }

  openForm() {
    this.form = { nombre: '', telefono: '' };
    this.editingId = null;
    this.showForm = true;
  }

  edit(item: Proveedor) {
    this.form = { ...item };
    this.editingId = item.id!;
    this.showForm = true;
  }

  async save() {
    if (!this.form.nombre?.trim()) return;
    if (this.editingId) {
      await this.service.update({ id: this.editingId, nombre: this.form.nombre!, telefono: this.form.telefono! });
    } else {
      await this.service.add({ nombre: this.form.nombre!, telefono: this.form.telefono! });
    }
    this.showForm = false;
    await this.load();
  }

  async delete(id: number) {
    if (confirm('¿Eliminar este proveedor?')) {
      await this.service.delete(id);
      await this.load();
    }
  }

  cancel() { this.showForm = false; }
}
