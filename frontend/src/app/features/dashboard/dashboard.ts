import { Component, inject, OnInit, effect } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

//Importamos las herramientas de Chart.js
import { Chart, registerables } from 'chart.js';

//Registramos los módulos gráficos
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html'
})

export default class Dashboard implements OnInit {
  public dashboardService = inject(DashboardService);
  public authService = inject(AuthService);

  // Variable para guardar el gráfico y poder destruirlo si hace falta
  private miGrafico: Chart | null = null;

  constructor() {
    effect(() => {
      const stats = this.dashboardService.resumen();

      if (stats) {
        setTimeout(() => {
          this.renderizarGrafico(stats);
        }, 0);
      }
    });
  }

  ngOnInit() {
    this.dashboardService.cargarResumen();
  }

  renderizarGrafico(stats: any) {
    // Si ya había un gráfico antes, lo destruimos para que no se superpongan
    if (this.miGrafico) {
      this.miGrafico.destroy();
    }

    const canvas = document.getElementById('graficoTrabajo') as HTMLCanvasElement;
    if (!canvas) return;

    // Creamos un gráfico
    this.miGrafico = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Avisos Pendientes', 'Albaranes Abiertos'],
        datasets: [{
          data: [stats.avisosPendientes, stats.albaranesAbiertos],
          backgroundColor: ['#f97316', '#4f46e5'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }
}
