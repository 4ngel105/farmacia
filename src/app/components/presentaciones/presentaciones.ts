import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PresentacionService } from '../../services/presentacion.service';
import { Presentacion } from '../../models/presentacion.model';

@Component({
  selector: 'app-presentaciones',
  imports: [FormsModule],
  templateUrl: './presentaciones.html'
})
export class PresentacionesComponent implements OnInit {
  presentaciones: Presentacion[] = [];
  form: Partial<Presentacion> = { nombre: '' };
  editingId: number | null = null;
  showForm = false;

  constructor(private service: PresentacionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  async load() {
    this.presentaciones = await this.service.getAll();
    this.cdr.detectChanges();
  }

  openForm() {
    this.form = { nombre: '' };
    this.editingId = null;
    this.showForm = true;
  }

  edit(item: Presentacion) {
    this.form = { ...item };
    this.editingId = item.id!;
    this.showForm = true;
  }

  async save() {
    if (!this.form.nombre?.trim()) return;
    if (this.editingId) {
      await this.service.update({ id: this.editingId, nombre: this.form.nombre! });
    } else {
      await this.service.add({ nombre: this.form.nombre! });
    }
    this.showForm = false;
    await this.load();
  }

  async delete(id: number) {
    if (confirm('¿Eliminar esta presentación?')) {
      await this.service.delete(id);
      await this.load();
    }
  }

  cancel() { this.showForm = false; }
}
