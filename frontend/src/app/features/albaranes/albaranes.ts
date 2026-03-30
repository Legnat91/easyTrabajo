import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PartesService } from '../../core/services/partes.service';
import { TareasService } from '../../core/services/avisos.service';
import { ClientesService } from '../../core/services/clientes.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-albaranes',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './albaranes.html',
})
export default class Albaranes implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private authService = inject(AuthService);

  public partesService = inject(PartesService);
  public tareasService = inject(TareasService);
  public clientesService = inject(ClientesService);


  // ESTADOS DE LA VISTA
  public mostrarFormulario = signal(false);
  public avisoSeleccionado = signal<number | null>(null);
  public esSoloLectura = signal(false);

  // ESTADOS DEL MODAL DE CIERRE
  public mostrarModalCierre = signal(false);
  private idParteCierre = signal<number | null>(null);
  private idTareaAsociada = signal<number | null>(null);

  // FORMULARIO REACTIVO
  public albaranForm = this.fb.group({
    id_parte_trabajo: [null as number | null],
    id_tarea: [null as number | null],
    id_cliente: [null as number | null, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    horas: [0],
    material: [''],
    observaciones: [''],
    id_empleado: [null as number | null]
  });

  ngOnInit() {

    this.partesService.cargarPartes();
    this.clientesService.cargarClientes();

    // Escuchar si venimos desde el Tablón de Avisos con un ID en la URL
    this.route.queryParams.subscribe(params => {
      if (params['aviso_id']) {
        const idAviso = Number(params['aviso_id']);
        this.precargarDatosAviso(idAviso);
      }
    });
  }

  // LÓGICA DEL FORMULARIO

 toggleFormulario() {
    this.mostrarFormulario.update(val => !val);
    if (!this.mostrarFormulario()) {
      this.albaranForm.reset();
      this.albaranForm.enable(); // Volvemos a habilitar por si estaba bloqueado
      this.esSoloLectura.set(false);
      this.avisoSeleccionado.set(null);
    }
  }

  precargarDatosAviso(idAviso: number) {
    // Si venimos con un aviso, mostramos el formulario automáticamente
    this.mostrarFormulario.set(true);
    this.avisoSeleccionado.set(idAviso);

    const aviso = this.tareasService.tareas().find(t => t.id_tarea === idAviso);
    const usuario = this.authService.usuarioActual();

    if (aviso) {
      this.albaranForm.patchValue({
        id_tarea: aviso.id_tarea,
        id_cliente: aviso.id_cliente,
        descripcion: `Resolución de aviso: ${aviso.descripcion}`,
        id_empleado: usuario ? usuario.id_empleado : null
      });
    } else {

      this.albaranForm.patchValue({ id_tarea: idAviso });
    }
  }


  editarAlbaran(albaran: any) {
    this.albaranForm.patchValue({
      id_parte_trabajo: albaran.id_parte_trabajo,
      id_tarea: albaran.id_tarea,
      id_cliente: albaran.id_cliente,
      descripcion: albaran.descripcion,
      horas: albaran.horas,
      material: albaran.material,
      observaciones: albaran.observaciones,
      id_empleado: albaran.id_empleado
    });


    this.albaranForm.patchValue({
      id_parte_trabajo: albaran.id_parte_trabajo,
      id_tarea: albaran.id_tarea,
      id_cliente: albaran.id_cliente,
      descripcion: albaran.descripcion,
      horas: albaran.horas,
      material: albaran.material,
      observaciones: albaran.observaciones,
      id_empleado: albaran.id_empleado
    });


    if (albaran.estado === 'Cerrado') {
      this.esSoloLectura.set(true);
      this.albaranForm.disable();
    } else {
      this.esSoloLectura.set(false);
      this.albaranForm.enable();
    }

    this.mostrarFormulario.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  // Guardar
  async guardarAlbaran() {
    if (this.albaranForm.invalid) return;

    const datos = this.albaranForm.value;
    const idEdicion = this.albaranForm.get('id_parte_trabajo')?.value;
    let exito = false;

    if (idEdicion) {

      exito = await this.partesService.actualizarParte(idEdicion, datos);
    } else {

      const datosNuevo = { ...datos, estado: 'En curso' };
      exito = await this.partesService.agregarParte(datosNuevo);
    }

    if (exito) {
      this.toggleFormulario();
    } else {
      alert("Hubo un error al guardar el albarán.");
    }
  }


  // LÓGICA DEL MODAL DE CIERRE

  abrirModalCierre(idParte: number, idTarea: number | null | undefined) {
    this.idParteCierre.set(idParte);
    this.idTareaAsociada.set(idTarea || null);
    this.mostrarModalCierre.set(true);
  }

  cancelarCierre() {
    this.mostrarModalCierre.set(false);
    this.idParteCierre.set(null);
    this.idTareaAsociada.set(null);
  }

 async confirmarCierre() {
    const id = this.idParteCierre();
    if (!id) return;

    const albaranOriginal = this.partesService.partes().find(p => p.id_parte_trabajo === id);

    const datosCierre = {
      ...albaranOriginal,
      estado: 'Cerrado',
      id_tarea: this.idTareaAsociada()
    };

    const exito = await this.partesService.actualizarParte(id, datosCierre);

    if (exito) {
      this.cancelarCierre();
    } else {
      alert("Error al intentar cerrar el parte.");
    }
  }
}
