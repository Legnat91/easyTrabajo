import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-administracion',
  imports: [ReactiveFormsModule],
  templateUrl: './administracion.html',
})
export default class Administracion implements OnInit {
  public adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  // Control de interfaz
  public pestanaActiva = signal<'empleados' | 'usuarios'>('empleados');
  public mostrarFormulario = signal(false);

  // Formulario de Empleados
  public empleadoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    apellido_2: [''],
    nif: [''],
    movil: [''],
    id_empresa: [1]
  });

  // Formulario de Usuarios
  public usuarioForm = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    id_rol: [null as number | null, [Validators.required]],
    id_empleado: [null as number | null],
    id_empresa: [1]
  });

  ngOnInit() {
    this.adminService.cargarRoles();
    this.adminService.cargarEmpleados();
    this.adminService.cargarUsuarios();
  }

  cambiarPestana(pestana: 'empleados' | 'usuarios') {
    this.pestanaActiva.set(pestana);
    this.mostrarFormulario.set(false);
  }

  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.empleadoForm.reset({ id_empresa: 1 });
      this.usuarioForm.reset({ id_empresa: 1, id_rol: null, id_empleado: null });
    }
  }

  async guardarEmpleado() {
    if (this.empleadoForm.invalid) return;
    const exito = await this.adminService.agregarEmpleado(this.empleadoForm.value);
    if (exito) this.toggleFormulario();
    else alert("Error al crear el empleado.");
  }

  async guardarUsuario() {
    if (this.usuarioForm.invalid) return;
    const exito = await this.adminService.agregarUsuario(this.usuarioForm.value);
    if (exito) this.toggleFormulario();
    else alert("Error al crear el usuario. Es posible que el correo ya exista.");
  }
}
