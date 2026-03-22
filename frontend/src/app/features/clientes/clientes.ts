import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientesService } from '../../core/services/clientes.service';
import { AuthService } from '../../core/services/auth.service';



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

    // Le pasamos los datos al servicio y le ponemos un "await"
    let exito = false;
    const datos = this.clienteForm.value;

    if (this.idClienteEditando()) {
      // MODO EDICIÓN
      exito = await this.clientesService.actualizarCliente(this.idClienteEditando()!, datos);
    } else {
      // MODO CREACIÓN
      exito = await this.clientesService.agregarCliente(datos as any);
    }

    // Cerramos el panel SOLO si se ha guardado bien en la base de datos
    if (exito) {
      this.toggleFormulario();
    } else {
      alert("Hubo un error al guardar en el servidor");
    }
  }
  async borrarCliente(id: number) {
    // Pedimos confirmación al usuario por seguridad
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      const exito = await this.clientesService.eliminarCliente(id);
      if (!exito) {
        alert("Error al intentar eliminar el cliente.");
      }
    }
  }
  irACrearAviso(idCliente: number) {
    this.router.navigate(['/avisos'], { queryParams: { cliente_id: idCliente } });
  }

  irACrearAlbaran(idCliente: number) {
    this.router.navigate(['/albaranes'], { queryParams: { cliente_id: idCliente } });
  }
}
