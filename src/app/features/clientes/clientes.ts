import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [ReactiveFormsModule], // <-- 1. ¡Crucial importar esto!
  templateUrl: './clientes.html',
})
export default class Clientes {
  public clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);

  // Señal para controlar si se ve la cajita del formulario
  public mostrarFormulario = signal(false);

  // 2. El "Molde" del formulario de cliente
  public clienteForm = this.fb.group({
    nif: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]], // El NIF español tiene 9 letras/números
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    poblacion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    prefijo: [34], // Por defecto ponemos el de España
    contacto: [null as number | null],
    cuota: [false] // Checkbox para saber si pagan mantenimiento (por defecto false)
  });

  // 3. Funciones del formulario
  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      // Al cerrar, limpiamos pero dejamos el prefijo por defecto en 34 y la cuota en false
      this.clienteForm.reset({ prefijo: 34, cuota: false });
    }
  }

  guardarCliente() {
    if (this.clienteForm.invalid) {
      console.warn('Formulario de cliente inválido', this.clienteForm.value);
      return;
    }

    // Le pasamos los datos al servicio
    this.clientesService.agregarCliente(this.clienteForm.value as any);

    // Cerramos el panel
    this.toggleFormulario();
  }
}
