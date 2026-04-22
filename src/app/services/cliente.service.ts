import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private store = 'clientes';
  constructor(private db: DbService) {}
  getAll() { return this.db.getAll<Cliente>(this.store); }
  add(item: Omit<Cliente, 'id'>) { return this.db.add<Cliente>(this.store, item); }
  update(item: Cliente) { return this.db.update<Cliente>(this.store, item); }
  delete(id: number) { return this.db.delete(this.store, id); }
}
