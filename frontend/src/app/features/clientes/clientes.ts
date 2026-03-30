import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientesService } from '../../core/services/clientes.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { TareasService } from '../../core/services/avisos.service';


@Component({
  selector: 'app-clientes',
  imports: [ReactiveFormsModule],
  templateUrl: './clientes.html',
})
export default class Clientes implements OnInit {
  public clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Señal para controlar si se ve la cajita del formulario
  public mostrarFormulario = signal(false);
  //Si tiene un ID, estamos editando. Si es null, estamos creando.
  public idClienteEditando = signal<number | null>(null);
  public authService = inject(AuthService);
  public alertService = inject(AlertService);

  // El Molde del formulario de cliente
  public clienteForm = this.fb.group({
    nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]], // El NIF español tiene 9 letras/números
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    poblacion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    prefijo: [34], // Por defecto ponemos el de España
    contacto: [null as number | null],
    cuota: [false] // Checkbox para saber si pagan mantenimiento (por defecto false)
  });
  ngOnInit() {
    // Al abrir la pantalla de Clientes, le decimos al servicio que vaya a buscar los datos a MariaDB
    this.clientesService.cargarClientes();
  }

  // Funciones del formulario
  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      // Al cerrar, limpiamos pero dejamos el prefijo por defecto en 34 y la cuota en false
      this.clienteForm.reset({ prefijo: 34, cuota: false });
      this.idClienteEditando.set(null); // Apagamos el modo edición
    }
  }
  //Rellena el formulario con los datos del cliente y lo abre
  abrirEditar(cliente: any) {
    this.idClienteEditando.set(cliente.id_cliente); // Encendemos el modo edición con este ID

    this.clienteForm.patchValue({
      nif: cliente.nif,
      nombre: cliente.nombre,
      poblacion: cliente.poblacion,
      direccion: cliente.direccion,
      // Convertimos el prefijo de MariaDB ("+34") a número para el formulario (34)
      prefijo: cliente.prefijo ? parseInt(cliente.prefijo.replace('+', '')) : 34,
      contacto: cliente.contacto,
      // MariaDB devuelve 1/0, el checkbox necesita true/false
      cuota: cliente.cuota == 1 ? true : false
    });

    this.mostrarFormulario.set(true);
  }
 async guardarCliente() {
  if (this.clienteForm.invalid) return;

  const datosFormulario = this.clienteForm.value;

  const datosParaGuardar = {
    ...datosFormulario,
    cuota: datosFormulario.cuota ? 1 : 0
  };

  let exito = false;

  if (this.idClienteEditando()) {
    exito = await this.clientesService.actualizarCliente(this.idClienteEditando()!, datosParaGuardar as any);
  } else {
    exito = await this.clientesService.agregarCliente(datosParaGuardar as any);
  }

  if (exito) {
    this.toggleFormulario();
    this.alertService.mostrar('¡Guardado!', 'El cliente se ha guardado correctamente.', 'success');
  } else {
    this.alertService.mostrar('Error', 'Hubo un error al guardar el cliente en el servidor.', 'error');
  }
}
  borrarCliente(id: number) {
    this.alertService.confirmar(
      '¿Dar de baja al cliente?',
      '¿Estás seguro que quieres dar de baja al cliente? No podrás deshacer esta acción.',
      async () => {

        const exito = await this.clientesService.eliminarCliente(id);
        if (exito) {
          this.alertService.mostrar('Eliminado', 'El cliente ha sido dado de baja con éxito.', 'info');
        } else {
          this.alertService.mostrar('Error', 'No se pudo dar de baja al cliente. Revisa tu conexión.', 'error');
        }
      }
    );
  }

  irACrearAviso(idCliente: number) {
    this.router.navigate(['/avisos'], { queryParams: { cliente_id: idCliente } });
  }

  irACrearAlbaran(idCliente: number) {
    this.router.navigate(['/albaranes'], { queryParams: { cliente_id: idCliente } });
  }
}
