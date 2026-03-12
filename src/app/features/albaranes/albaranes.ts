import { AlbaranesService } from '../../core/services/albaranes.services';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-albaranes',
  imports: [DatePipe,ReactiveFormsModule],
  templateUrl: './albaranes.html',
})
export default class Albaranes implements OnInit {
  public albaranesService = inject(AlbaranesService);
  private route = inject(ActivatedRoute); //  Inyectamos la ruta activa
  private fb = inject(FormBuilder);

  // Creamos una señal para guardar el ID del aviso si venimos de allí
  public avisoSeleccionado = signal<number | null>(null);
  public mostrarFormulario = signal(false);

  //Creamos el molde de Albarán
  public albaranForm = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    id_cliente: [null, [Validators.required]],
    id_tarea: [null as number | null],
    id_empleado: [5]
  });

  // El ngOnInit se ejecuta automáticamente cuando carga la pantalla
  ngOnInit() {
    // Nos suscribimos a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      // Si en la URL existe "aviso_id"
      if (params['aviso_id']) {
        const idAviso = Number(params['aviso_id']);
        // Actualizamos nuestra señal
        this.avisoSeleccionado.set(idAviso);
        //Rellenamos el formulario automaticamente con el ID de aviso
        this.albaranForm.patchValue({
          id_tarea: idAviso
        });
        //Abrimos el formulario automaticamente
        this.mostrarFormulario.set(true);
      }
    });
  }

    toggleFormulario(){
      this.mostrarFormulario.update(v=>!v);
      if(!this.mostrarFormulario()){
        //Si se cierra el form, se limpia pero mantiene al empleado
        this.albaranForm.reset({id_empleado:5});
      }
    }

    guardarAlbaran(){
      if (this.albaranForm.invalid)return;
      this.albaranesService.agregarAlbaram(this.albaranForm.value);

      //Limpiamos la url y el aviso seleccionado despues de guardar
      this.avisoSeleccionado.set(null);
      this.toggleFormulario();
    }
}
