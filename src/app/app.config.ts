import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'lead-your-way',
        appId: '1:291293981558:web:9433f88dc826ae36f3a857',
        storageBucket: 'lead-your-way.appspot.com',
        apiKey: 'AIzaSyBQqP-iPv8_mv9N9MOUBKiWyj0dcCvM710',
        authDomain: 'lead-your-way.firebaseapp.com',
        messagingSenderId: '291293981558',
        measurementId: 'G-TPGZXN7CNM',
      })
    ),
    provideAuth(() => getAuth()),
    provideAnimations(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ],
};
