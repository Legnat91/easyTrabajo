import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbaranesService } from '../../core/services/albaranes.service'; // Asegúrate de que no termine en .services si lo cambiaste
import { TareasService } from '../../core/services/tareas.service';

@Component({
  selector: 'app-albaranes',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './albaranes.html',
})
export default class Albaranes implements OnInit {
  public albaranesService = inject(AlbaranesService);
  public tareasService = inject(TareasService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  public avisoSeleccionado = signal<number | null>(null);
  public mostrarFormulario = signal(false);
  public mostrarModalCierre = signal(false);
  public albaranParaCerrar = signal<{ idParte: number, idTarea?: number } | null>(null);

  public albaranForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    id_cliente: [null, [Validators.required]],
    id_tarea: [null as number | null],
    id_empleado: [5]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['aviso_id']) {
        const idAviso = Number(params['aviso_id']);
        this.avisoSeleccionado.set(idAviso);

        this.albaranForm.patchValue({
          id_tarea: idAviso
        });

        // Esto es lo que hace que el formulario se abra automáticamente
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
