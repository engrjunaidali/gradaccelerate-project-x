import { showErrorAlert } from './alert-utils';

export const setupGlobalErrorHandlers = () => {
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorAlert('Something went wrong, please try again later.');
    
    // Capture with Sentry
    try {
      // @ts-ignore
      if (window.Sentry) {
        // @ts-ignore
        window.Sentry.captureException(event.error);
      }
    } catch (sentryError) {
      console.warn('Sentry capture failed:', sentryError);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorAlert('Something went wrong, please try again later.');
    
    // Capture with Sentry
    try {
      // @ts-ignore
      if (window.Sentry) {
        // @ts-ignore
        window.Sentry.captureException(event.reason);
      }
    } catch (sentryError) {
      console.warn('Sentry capture failed:', sentryError);
    }
    
    event.preventDefault();
  });
};

export default setupGlobalErrorHandlers;
