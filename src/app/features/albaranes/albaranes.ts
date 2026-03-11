import { AlbaranesService } from '../../core/services/albaranes.services';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-albaranes',
  imports: [DatePipe],
  templateUrl: './albaranes.html',
  styleUrl: './albaranes.css',
})
export default class Albaranes implements OnInit {
  public albaranesService = inject(AlbaranesService);
  private route = inject(ActivatedRoute); // 2. Inyectamos la ruta activa

  // 3. Creamos una señal para guardar el ID del aviso si venimos de allí
  public avisoSeleccionado = signal<number | null>(null);

  // 4. El ngOnInit se ejecuta automáticamente cuando carga la pantalla
  ngOnInit() {
    // Nos suscribimos a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      // Si en la URL existe "aviso_id" (localhost:4200/albaranes?aviso_id=1)
      if (params['aviso_id']) {
        // Actualizamos nuestra señal
        this.avisoSeleccionado.set(Number(params['aviso_id']));
      } else {
        // Si entramos desde el menú superior limpio, la señal es null
        this.avisoSeleccionado.set(null);
      }

    });
  }
}
