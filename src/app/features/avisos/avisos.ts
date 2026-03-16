import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TareasService } from '../../core/services/tareas.service';

@Component({
  selector: 'app-avisos',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './avisos.html', // Aquí enlazamos con el archivo HTML separado
})
export default class Avisos {
  public tareasService = inject(TareasService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public mostrarFormulario = signal(false);

  public avisoForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    importancia: ['Normal', [Validators.required]],
    persona_contacto: [''],
    telefono_contacto: [''],
    id_empleado: [null],
    id_empresa: [1, [Validators.required]]
  });

  cogerAviso(idTarea: number) {
    const idEmpleadoActual = 5;
    this.tareasService.asignarTarea(idTarea, idEmpleadoActual);
  }

  irACrearAlbaran(idTarea: number) {
    this.router.navigate(['/albaranes'], { queryParams: { aviso_id: idTarea } });
  }


  toggleFormulario() {
    this.mostrarFormulario.update(valor => !valor);
    this.avisoForm.reset({ importancia: 'Normal', id_empresa: 1 });
  }

  guardarAviso() {
    if (this.avisoForm.invalid) return;

    const nuevoAviso = this.avisoForm.value;
    this.tareasService.agregarTarea(nuevoAviso);


    this.toggleFormulario();
  }

cancelarAviso(idTarea: number) {
    this.tareasService.cancelarTarea(idTarea);
  }


}
