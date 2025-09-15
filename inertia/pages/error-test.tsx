import { useState } from 'react';
import { Head } from '@inertiajs/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { showErrorAlert } from '../lib/alert-utils';

const ErrorTestComponent = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleToastError = () => {
    showErrorAlert('Something went wrong, please try again later.');
  };

  const handleBoundaryError = () => {
    setShouldThrowError(true);
  };

  const handleGlobalError = () => {
    // Trigger a global JavaScript error
    // @ts-ignore
    unknownFunction();
  };

  const handlePromiseRejection = () => {
    // Trigger an unhandled promise rejection
    Promise.reject(new Error('Test promise rejection error!'));
  };

  if (shouldThrowError) {
    throw new Error('Test error for error boundary!');
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Testing Dashboard</h3>
      <p className="text-red-700 mb-4">Test different types of error handling:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleToastError}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Show Error Toast
        </button>
        <button
          onClick={handleBoundaryError}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Trigger Error Boundary
        </button>
        <button
          onClick={handleGlobalError}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Global Error
        </button>
        <button
          onClick={handlePromiseRejection}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Promise Rejection
        </button>
      </div>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <>
      <Head title="Error Testing" />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Testing Page</h1>
            <p className="text-gray-600">Test various error scenarios and error boundary behavior</p>
          </div>
        
        <ErrorBoundary>
          <ErrorTestComponent />
        </ErrorBoundary>
        
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
