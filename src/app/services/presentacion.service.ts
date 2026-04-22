import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Presentacion } from '../models/presentacion.model';

@Injectable({ providedIn: 'root' })
export class PresentacionService {
  private store = 'presentaciones';
  constructor(private db: DbService) {}
  getAll() { return this.db.getAll<Presentacion>(this.store); }
  add(item: Omit<Presentacion, 'id'>) { return this.db.add<Presentacion>(this.store, item); }
  update(item: Presentacion) { return this.db.update<Presentacion>(this.store, item); }
  delete(id: number) { return this.db.delete(this.store, id); }
}
