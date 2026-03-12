import { Injectable, signal } from '@angular/core';
import { Cliente } from '../interfaces/cliente.interfaces';

@Injectable({
  providedIn: 'root'
})

export class ClientesService {

  public clientes = signal<Cliente[]>([
    {
      id_cliente: 1,
      nif: 'B12345678',
      nombre: 'Empresa Tecnológica S.L.',
      poblacion: 'Madrid',
      direccion: 'Calle de la Innovación, 45',
      prefijo: 34,
      contacto: 600112233,
      cuota: true // Este cliente tiene contrato de mantenimiento
    },
    {
      id_cliente: 2,
      nif: '45678912A',
      nombre: 'Gestoría Martínez',
      poblacion: 'Valencia',
      direccion: 'Avenida de los Contables, 12',
      prefijo: 34,
      contacto: 655998877,
      cuota: false
    }
  ]);

  agregarCliente(nuevoCliente:Cliente){
    this.clientes.update(actuales=>{
      const maxId=actuales.length>0?Math.max(...actuales.map(c=>c.id_cliente||0)):0;
      return[{...nuevoCliente,id_cliente:maxId+1}];
    });
  }


}

