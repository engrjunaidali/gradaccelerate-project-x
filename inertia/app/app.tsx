/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import * as Sentry from "@sentry/react";
import ErrorBoundary from '../components/ErrorBoundary';
import { setupGlobalErrorHandlers } from '../lib/global-error-handler';

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

// Initialize Sentry
Sentry.init({ 
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV || 'development',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

// Make Sentry available globally for error boundary
// @ts-ignore
window.Sentry = Sentry;

// Set up global error handlers with SweetAlert
setupGlobalErrorHandlers();

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }: any) {
    hydrateRoot(el, (
      <ErrorBoundary>
        <App {...props} />
      </ErrorBoundary>
    ))
  },
});