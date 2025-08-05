import React, { useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { TodoAuth } from '../../lib/TodoAuth'

interface GoogleTokenProps {
  token: string
}

const GoogleToken: React.FC<GoogleTokenProps> = ({ token }) => {
  useEffect(() => {
    if (token) {
      // Save the JWT token from Google authentication
      TodoAuth.saveToken(token)

      // Redirect to todos page
      setTimeout(() => {
        window.location.href = '/todos'
      }, 1500)
    } else {
      // If no token, show error and redirect to login
      setTimeout(() => {
        window.location.href = '/auth/jwt/login'
      }, 2000)
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title="Google Authentication" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Completing Google Authentication...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we set up your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleToken
