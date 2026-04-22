import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Proveedor } from '../models/proveedor.model';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private store = 'proveedores';
  constructor(private db: DbService) {}
  getAll() { return this.db.getAll<Proveedor>(this.store); }
  add(item: Omit<Proveedor, 'id'>) { return this.db.add<Proveedor>(this.store, item); }
  update(item: Proveedor) { return this.db.update<Proveedor>(this.store, item); }
  delete(id: number) { return this.db.delete(this.store, id); }
}
