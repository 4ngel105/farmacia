import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'medicamentos', pathMatch: 'full' },
  {
    path: 'medicamentos',
    loadComponent: () => import('./components/medicamentos/medicamentos').then(m => m.MedicamentosComponent)
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./components/proveedores/proveedores').then(m => m.ProveedoresComponent)
  },
  {
    path: 'presentaciones',
    loadComponent: () => import('./components/presentaciones/presentaciones').then(m => m.PresentacionesComponent)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./components/clientes/clientes').then(m => m.ClientesComponent)
  }
];
