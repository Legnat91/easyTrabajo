import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';

import { TareasService } from '../../core/services/avisos.service';
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
  public idAvisoEditando = signal<number | null>(null); // Control de edición

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
    //Cargar los avisos desde PHP
    this.tareasService.cargarTareas();

    //Cargar los clientes
    this.clientesService.cargarClientes();

    this.route.queryParams.subscribe(params => {
      if (params['cliente_id']) {
        const idCliente = Number(params['cliente_id']);
        this.avisoForm.patchValue({ id_cliente: idCliente });
        this.mostrarFormulario.set(true);
      }
    });
  }

  //FORMULARIO DE EDICION
  abrirEditar(tarea: any) {
    this.idAvisoEditando.set(tarea.id_tarea);
    this.avisoForm.patchValue({
      descripcion: tarea.descripcion,
      importancia: tarea.importancia,
      id_cliente: tarea.id_cliente,
      persona_contacto: tarea.persona_contacto,
      telefono_contacto: tarea.telefono_contacto,
      id_empleado: tarea.id_empleado,
      id_empresa: tarea.id_empresa
    });
    this.mostrarFormulario.set(true);
  }

  toggleFormulario() {
    this.mostrarFormulario.update(valor => !valor);
    if (!this.mostrarFormulario()) {
      this.avisoForm.reset({ importancia: 'Normal', id_empresa: 1, id_cliente: null, id_empleado: null });
      this.idAvisoEditando.set(null);
    }
  }

  async guardarAviso() {
    if (this.avisoForm.invalid) return;

    const datosFormulario = this.avisoForm.value;
    let exito = false;

    if (this.idAvisoEditando()) {

      exito = await this.tareasService.actualizarTarea(this.idAvisoEditando()!, datosFormulario);
    } else {

      const estadoInicial = datosFormulario.id_empleado ? 'En proceso' : 'Pendiente';
      exito = await this.tareasService.agregarTarea({ ...datosFormulario, estado: estadoInicial });
    }

    if (exito) {
      this.toggleFormulario();
    } else {
      alert("Hubo un error al guardar el aviso.");
    }
  }

  cogerAviso(idTarea: number) {
    const idEmpleadoActual = 5;//BORRAR ESTO ES UNA SIMULACION
    this.tareasService.asignarTarea(idTarea, idEmpleadoActual);
  }

  irACrearAlbaran(idTarea: number) {
    this.router.navigate(['/albaranes'], { queryParams: { aviso_id: idTarea } });
  }

  cancelarAviso(idTarea: number) {
    if (confirm('¿Estás seguro de cancelar este aviso?')) {
      this.tareasService.cancelarTarea(idTarea);
    }

  }
}
