import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlbaranesService } from '../../core/services/albaranes.service';
import { TareasService } from '../../core/services/avisos.service';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-albaranes',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './albaranes.html',
})

export default class Albaranes implements OnInit {
  public albaranesService = inject(AlbaranesService);
  public tareasService = inject(TareasService);
  public clientesService=inject(ClientesService);

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  public avisoSeleccionado = signal<number | null>(null);
  public mostrarFormulario = signal(false);
  public mostrarModalCierre = signal(false);
  public albaranParaCerrar = signal<{ idParte: number, idTarea?: number } | null>(null);

  public albaranForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    id_cliente: [null as number | null, [Validators.required]],
    id_tarea: [null as number | null],
    id_empleado: [5]
  });

 ngOnInit() {
    this.route.queryParams.subscribe(params => {

      // CASO A: Venimos desde la tarjeta de un AVISO
      if (params['aviso_id']) {
        const idAviso = Number(params['aviso_id']);
        this.avisoSeleccionado.set(idAviso);

        const avisoOriginal = this.tareasService.tareas().find(t => t.id_tarea === idAviso);
        const clienteDelAviso = avisoOriginal ? avisoOriginal.id_cliente : null;

        this.albaranForm.patchValue({
          id_tarea: idAviso,
          id_cliente: clienteDelAviso as number | null
        });

        this.mostrarFormulario.set(true);
      }
      // CASO B: Venimos directamente desde la tabla de CLIENTES (NUEVO)
      else if (params['cliente_id']) {
        const idCliente = Number(params['cliente_id']);

        this.albaranForm.patchValue({
          id_cliente: idCliente
        });

        this.mostrarFormulario.set(true);
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.albaranForm.reset({ id_empleado: 5 });
    }
  }

  guardarAlbaran() {
    if (this.albaranForm.invalid) {
      console.warn('Formulario inválido', this.albaranForm.value);
      return;
    }

    this.albaranesService.agregarAlbaran(this.albaranForm.value);

    this.avisoSeleccionado.set(null);
    this.toggleFormulario();
  }

  // --- Lógica del Modal de Cierre ---
  abrirModalCierre(idParte: number, idTarea?: number) {
    this.albaranParaCerrar.set({ idParte, idTarea });
    this.mostrarModalCierre.set(true);
  }

  cancelarCierre() {
    this.mostrarModalCierre.set(false);
    this.albaranParaCerrar.set(null);
  }

  confirmarCierre() {
    const datos = this.albaranParaCerrar();
    if (datos) {
      this.albaranesService.cerrarAlbaran(datos.idParte);
      if (datos.idTarea) {
        this.tareasService.finalizarTarea(datos.idTarea);
      }
    }
    this.cancelarCierre();
  }
}
