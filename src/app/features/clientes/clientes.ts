import { Component, inject } from '@angular/core';
import { ClientesService } from '../../core/services/clientes.services';

@Component({
  selector: 'app-clientes',
  imports: [],
  templateUrl: './clientes.html',
})
export class Clientes {
  public clientesService=inject(ClientesService);
}
