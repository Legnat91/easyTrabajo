import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';

import { TareasService } from '../../core/services/tareas.service';
import { ClientesService } from '../../core/services/clientes.service';

@Component({
  selector: 'app-avisos',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './avisos.html', // Aquí enlazamos con el archivo HTML separado
})
export default class Avisos implements OnInit {
  public tareasService = inject(TareasService);
  public clientesService=inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  public mostrarFormulario = signal(false);

  public avisoForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    importancia: ['Normal', [Validators.required]],
    id_cliente: [null as number | null, [Validators.required]], // <-- ¡NUEVO CAMPO! Obligatorio
    persona_contacto: [''],
    telefono_contacto: [''],
    id_empleado: [null],
    id_empresa: [1, [Validators.required]]
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['cliente_id']) {
        const idCliente = Number(params['cliente_id']);

        // Autocompletamos el cliente en el formulario
        this.avisoForm.patchValue({ id_cliente: idCliente });

        // Abrimos el panel del formulario mágicamente
        this.mostrarFormulario.set(true);
      }
    });
  }

  cogerAviso(idTarea: number) {
    const idEmpleadoActual = 5;
    this.tareasService.asignarTarea(idTarea, idEmpleadoActual);
  }

  irACrearAlbaran(idTarea: number) {
    this.router.navigate(['/albaranes'], { queryParams: { aviso_id: idTarea } });
  }


  toggleFormulario() {
    this.mostrarFormulario.update(valor => !valor);
    this.avisoForm.reset({ importancia: 'Normal', id_empresa: 1, id_cliente: null, id_empleado: null });
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
