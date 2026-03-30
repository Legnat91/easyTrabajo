import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public isVisible = signal(false);
  public title = signal('');
  public message = signal('');
  public type = signal<AlertType>('info');


  private confirmCallback: (() => void) | null = null;


  mostrar(titulo: string, mensaje: string, tipo: AlertType = 'info') {
    this.title.set(titulo);
    this.message.set(mensaje);
    this.type.set(tipo);
    this.confirmCallback = null;
    this.isVisible.set(true);
  }


  confirmar(titulo: string, mensaje: string, accionConfirmar: () => void) {
    this.title.set(titulo);
    this.message.set(mensaje);
    this.type.set('confirm');
    this.confirmCallback = accionConfirmar;
    this.isVisible.set(true);
  }

  cerrar() {
    this.isVisible.set(false);
    this.confirmCallback = null;
  }

  aceptarConfirmacion() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.cerrar();
  }
}
