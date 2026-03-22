import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideZonelessChangeDetection(),

    provideRouter(routes),

    // Configuramos el cliente HTTP con nuestro interceptor de seguridad
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
