/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import * as Sentry from "@sentry/react";
const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

Sentry.init({ 
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true
 });
 // Capture an exception
try {
  console.log('About to throw an error');
  throw new Error("Test error 2");
} catch (e) {
  Sentry.captureException(e);
}

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    
    hydrateRoot(el, <App {...props} />)
    
  },
});