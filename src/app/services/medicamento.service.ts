import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Medicamento } from '../models/medicamento.model';

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private store = 'medicamentos';
  constructor(private db: DbService) {}
  getAll() { return this.db.getAll<Medicamento>(this.store); }
  add(item: Omit<Medicamento, 'id'>) { return this.db.add<Medicamento>(this.store, item); }
  update(item: Medicamento) { return this.db.update<Medicamento>(this.store, item); }
  delete(id: number) { return this.db.delete(this.store, id); }
}
