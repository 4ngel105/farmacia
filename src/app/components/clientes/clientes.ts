import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule],
  templateUrl: './clientes.html'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  form: Partial<Cliente> = { carnet: '', nombre: '', telefono: '' };
  editingId: number | null = null;
  showForm = false;

  constructor(private service: ClienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  async load() {
    this.clientes = await this.service.getAll();
    this.cdr.detectChanges();
  }

  openForm() {
    this.form = { carnet: '', nombre: '', telefono: '' };
    this.editingId = null;
    this.showForm = true;
  }

  edit(item: Cliente) {
    this.form = { ...item };
    this.editingId = item.id!;
    this.showForm = true;
  }

  async save() {
    if (!this.form.carnet?.trim() || !this.form.nombre?.trim()) return;
    const data = {
      carnet: this.form.carnet!,
      nombre: this.form.nombre!,
      telefono: this.form.telefono ?? ''
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
    if (confirm('¿Eliminar este cliente?')) {
      await this.service.delete(id);
      await this.load();
    }
  }

  cancel() { this.showForm = false; }
}
