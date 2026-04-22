import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'farmaciaDB';
  private readonly DB_VERSION = 1;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) { resolve(this.db); return; }
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('presentaciones'))
          db.createObjectStore('presentaciones', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('proveedores'))
          db.createObjectStore('proveedores', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('medicamentos')) {
          const s = db.createObjectStore('medicamentos', { keyPath: 'id', autoIncrement: true });
          s.createIndex('presentacionId', 'presentacionId');
          s.createIndex('proveedorId', 'proveedorId');
        }
        if (!db.objectStoreNames.contains('clientes'))
          db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
      };
      req.onsuccess = (e) => { this.db = (e.target as IDBOpenDBRequest).result; resolve(this.db); };
      req.onerror = () => reject(req.error);
    });
  }

  getAll<T>(store: string): Promise<T[]> {
    return this.openDB().then(db => new Promise((res, rej) => {
      const req = db.transaction(store, 'readonly').objectStore(store).getAll();
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    }));
  }

  add<T>(store: string, item: Omit<T, 'id'>): Promise<number> {
    return this.openDB().then(db => new Promise((res, rej) => {
      const req = db.transaction(store, 'readwrite').objectStore(store).add(item);
      req.onsuccess = () => res(req.result as number);
      req.onerror = () => rej(req.error);
    }));
  }

  update<T>(store: string, item: T): Promise<void> {
    return this.openDB().then(db => new Promise((res, rej) => {
      const req = db.transaction(store, 'readwrite').objectStore(store).put(item);
      req.onsuccess = () => res();
      req.onerror = () => rej(req.error);
    }));
  }

  delete(store: string, id: number): Promise<void> {
    return this.openDB().then(db => new Promise((res, rej) => {
      const req = db.transaction(store, 'readwrite').objectStore(store).delete(id);
      req.onsuccess = () => res();
      req.onerror = () => rej(req.error);
    }));
  }
}
